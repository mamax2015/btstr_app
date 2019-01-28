var phoneList;

function PhoneList(){
	this.currentPage = 1;
	this.list = [];
	this.toDisplay = [];
	this.filteredPhones = [];
	this.htmlHolder = document.getElementById("phone-list");
	this.filterInput = document.getElementById("filter-phones");
	this.pagers = document.getElementById("pagers");
	this.phonesPerPage = 5;
	this.activePage = 1;
	this.filterString = '';
	this.clearButton = document.getElementById("clear-list");
	this.deletedPhones = [];
	this.changePageClass = "change-page-button";
	this.pageAttr = "data-page";
	this.deletePhoneClass = "delete-phone";
	this.phoneIdAttr = "data-phone-id";
}
PhoneList.prototype.init = function(){
	var app = this;
	window.addEventListener("keyup",function(){
		var target = event.target; // where was the click?
		if( target === app.filterInput){
			app.clearButton.disabled = !target.value;
			app.filterPhones(target.value);
			app.updatePhoneListPage()
		}
	});	
	window.addEventListener("click",function(event){
		var target = event.target;
		var clickFinded = false;
		while ( target && target.nodeName !== 'BODY' && !clickFinded) {
			if( target.classList && target.classList.contains(app.changePageClass)){
				event.preventDefault();
				var newPage = parseInt(target.getAttribute(app.pageAttr));
				app.activePage = newPage;
				app.updatePhoneListPage();				
				clickFinded = true;
			}
			if(target === app.clearButton){
				event.preventDefault();				
				if(!target.disabled){
					app.clearButton.disabled = true;
					app.filterInput.value = '';
					app.filterPhones();
					app.updatePhoneListPage();
				}		
				clickFinded = true;	
			}
			if( target.classList && target.classList.contains(app.deletePhoneClass)){
				event.preventDefault();
				var hidePhone = target.getAttribute(app.phoneIdAttr);
				app.deletedPhones.push(hidePhone);
				app.updatePhoneListPage();
				clickFinded = true;
			}
			target = target.parentNode;
		}
		return false;
	});		
	this.list = phones;
}

PhoneList.prototype.updatePager = function(){
	var pages = Math.ceil(this.filteredPhones.length / this.phonesPerPage);
	var buttons = [];
	var activeClass = '';
	var pageButtonLayout = '';
	var pageButton;
	this.pagers.innerHTML = '';
	for(var i=1; i<=pages; i++){
		activeClass = '';
		if(i === this.activePage){
			activeClass = 'active';
		}
		pageButtonLayout = `
			<button 
				type="button" 
				class="btn btn-outline-secondary ${activeClass} change-page-button" 
				data-page="${i}">
					${i}
			</button>`;
		pageButton = htmlToElements(pageButtonLayout);
		this.pagers.appendChild(pageButton);
	}
}

PhoneList.prototype.filterPhones = function(filterString){
	if(!filterString){
		this.filteredPhones = this.list;		
	}else{
		filterString = filterString.toLowerCase();
		this.filteredPhones = this.list.filter(function(phone){
			if(phone.name.toLowerCase().indexOf(filterString) !== -1){				
				return phone;
			}
		});
	}
	this.activePage = 1;
}

PhoneList.prototype.updatePhoneListPage = function(){
	this.excludeDeletedPhones();
	this.preparePhonePage();
	this.updatePager();
	this.createListToRender();
}

PhoneList.prototype.excludeDeletedPhones = function(page){
	var deletedPhones = this.deletedPhones;
	this.filteredPhones = this.filteredPhones.filter(function(phone,index){
		return !(deletedPhones.indexOf(phone.id) !== -1);
	});
}

PhoneList.prototype.preparePhonePage = function(page){
	var phonesPerPage = this.phonesPerPage;
	var activePage = this.activePage;
	this.toDisplay = this.filteredPhones.filter(function(phone,index){
		var currentPage = parseInt(index / phonesPerPage) + 1;
		return currentPage === activePage; 
	});	
}

PhoneList.prototype.createListToRender = function(){
	var preparePhone = this.preparePhone.bind(this);
	this.htmlToRender = this.toDisplay.map(function(phone){
		return preparePhone(phone);
	});
	this.updatePhoneList();
}

PhoneList.prototype.updatePhoneList = function(){
	var htmlHolder = this.htmlHolder;
	htmlHolder.innerHTML = '';
	this.htmlToRender.forEach(function(phoneString){
		var phoneToView = htmlToElements(phoneString);
		htmlHolder.appendChild(phoneToView);
	});
}

PhoneList.prototype.preparePhone = function(phoneInfo){
	return `
	<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 ">
		<div class="item mb-5">
		  <div class="image-block mb-5">
		    <img class="item-image" src="${phoneInfo.image}">
		  </div>
		  <div class="dark-hover"></div>
		  <a href="#" class="remove-link delete-phone" data-phone-id="${phoneInfo.id}">remove from list</a>
		  <div class="item-info">
		    <div class="title">${phoneInfo.name}</div>
		    <div class="price">${phoneInfo.price}</div>
		    <div class="actions">
		      <div class="btn-group" role="group" aria-label="First group">
		        <button type="button" class="btn btn-outline-secondary"><i class="fas fa-shopping-cart"></i></button>
		        <button type="button" class="btn btn-outline-secondary delete-phone" data-phone-id="${phoneInfo.id}"><i class="fas fa-trash-alt"></i></button>
		      </div>        
		    </div>
		  </div>
		</div>
	</div>`;    
}

function htmlToElements(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

window.addEventListener("load", function(event) {
	window.phoneList = new PhoneList();
	phoneList.init();
	phoneList.filterPhones();
	phoneList.updatePhoneListPage();
});


