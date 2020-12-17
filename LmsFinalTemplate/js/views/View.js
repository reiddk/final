class View {

    searchWaiter;
    searchVal;

    constructor(viewModel, listContainerId, formContainerId, apiUrl, apiKey) {
        this.storage = new RestStorageService(apiUrl, apiKey, viewModel.list.options);
        this.viewModel = viewModel; //viewModel has all view related meta data.
        this.listContainerId = listContainerId; //containerIds
        this.formContainerId = formContainerId;

    }
    //handy getters
    get $form() { //getter for jquery wrapped form object
        return $("#" + this.viewModel.form.id);
    }
    
    get form() { this.$form.get(0); }
    get $listContainer() { return $("#" + this.listContainerId); }
    get $formContainer() { return $("#" + this.formContainerId); }

    /* Giving you this one */
    async renderList() {
        try {
            this.viewModel.data = await this.storage.list();

            //traverse view model and find select inputs and preload any lookups (teams, coaches)
            await this.populateLookups();

            //render the list
            let templateHtml = await this.templateHTML(this.viewModel.list.templateUrl);
            this.listTemplate = _.template(templateHtml);
 
            //render lodash template passing in 'this' as the 'view'
            //this will allow you to utilize view class functions in your template rendering
            this.$listContainer.html(this.listTemplate({ view: this })); 
            this.bindListEvents();

        }
        catch (err) {
            console.error(err);
        }
    } 

    runSearch() {
        clearTimeout(this.searchWaiter);
        this.searchWaiter = setTimeout(() => {
            if (this.searchVal.length > 1) {
                this.storage.defaultOptions.filter_str = this.searchVal;
            } else {
                this.storage.defaultOptions.filter_str = "";
            }
            this.renderList();
            
        }, 250);
    }


    bindListEvents() {
        //TODO
        //Hint: if you name each button 'btn-<item-id>' (replacing <item-id> with id of current data item)
        // that makes it much easier to create your callbacks after rendering the list

        //create your event listeners for each table row button/icon
        // callbacks should reference the 'renderform(id)', and 'deleteListItem(id)', 'showInfo()'

        // create event listener for 'Create' button,
        // callback calls 'this.renderForm(null)'
        $(`.${this.viewModel.form.id}-delete`)
        .on("click", (data) => {
            const id = $(data.target).attr('data-id');
            if (id && !isNaN(id)) {
                this.deleteListItem(Number(id));
            }
        });
        $(`.${this.viewModel.form.id}-edit`)
        .on("click", (data) => {
            const id = $(data.target).attr('data-id');
            if (id && !isNaN(id)) {
                this.renderForm(Number(id));
            }
        });
        $(`.${this.viewModel.form.id}-info`)
        .on("click", (data) => {
            const id = $(data.target).attr('data-id');
            if (id && !isNaN(id)) {
                this.showInfo(Number(id));
            }
        });
        $(`.${this.viewModel.form.id}-create`)
        .on("click", () => {
            console.log('asdfasdf');
            this.renderForm();
        });

        $(`.sortable`).on("click", (e) => {
            const dataName = $(e.target).attr('data-name');
            if (this.storage.defaultOptions.sort_col === dataName) {
                if (this.storage.defaultOptions.sort_dir === 'desc') {
                    this.storage.defaultOptions.sort_dir = 'asc';
                } else {
                    this.storage.defaultOptions.sort_dir = 'desc';
                }
            } else {
                this.storage.defaultOptions.sort_dir = 'asc';
            }
            this.storage.defaultOptions.sort_col = dataName;
            this.renderList();
        });
        $('.searchfield').on("keyup", (e) => {
            this.searchVal = $(e.target).val();
            this.runSearch();
        });
    }
    async showInfo(id) { 
        //TODO
        //show info popup
        const dataToShow = this.viewModel.data.find(d => d.id === id); 
        const template = await this.templateHTML('js/views/templates/infoTemplate.html');
        const infoTemplate = _.template(template);
        $('#info-template').html(infoTemplate({ view: this, data: dataToShow  })); 
        $('#modalLabel').text(this.viewModel.list.listTitle);
        $('#modal-submit').hide();
        $('#exampleModal').modal('show');
    }

    async notifyMe(message, error = false) {
        if (error) {   
            $('.notification-alert').css('background-color', 'red');
        } else {
            $('.notification-alert').css('background-color',  '#027bff');
        }
        $('.notification-alert').text(message);
        $('.notification-alert').show(100);
        await new Promise(resolve => {setTimeout(() => resolve(), 5000);});
        $('.notification-alert').hide(100);
    }

    async deleteListItem(id) {
        //TODO
        //confirm delete
        //call storage service delete(id)
        //perform any hiding/showing/animation of row

        
        const teamLabel = this.getLookup(this.viewModel.form.lookupName, id);
        const template = await this.templateHTML('js/views/templates/confirmTemplate.html')
        const infoTemplate = _.template(template);
        $('#info-template').html(infoTemplate({ question: `Are you sure you want to ${this.viewModel.form.deleteTitle}, ${teamLabel}?`  })); 
        $('#modalLabel').text(this.viewModel.form.deleteTitle);
        $('#modal-submit').show();
        $('#exampleModal').modal('show');

       // document.getElementById('modal-submit').removeEventListener("click", this.runDeleteCode(id));
       $('#modal-submit').attr("data-id", id);
        document.getElementById('modal-submit').addEventListener("click", async () => {
            const theID = $('#modal-submit').attr("data-id");
            $('#exampleModal').modal('hide');
            $(`#${this.viewModel.form.id}-${theID}`).hide(600);
            await new Promise(resolve => setTimeout(() => resolve(), 500));
            
            this.storage.delete(theID).then((out) => {
                this.notifyMe("Deletion was successful");
                this.renderList();
            }).catch((e) => {
                console.error(e);
            });
        });


    }

    getLookup(lookupName, id) {
        const lookups = this.storage.lookups;
        if (lookups) {
            const lookupArrByName = lookups[lookupName];
            if (lookupArrByName) {
                const lookupObj = lookupArrByName.find(l => l.value === id);
                if (lookupObj) {
                    return lookupObj.label;
                }
            }
        }
        return null;
    }

    async renderForm(id = null) {
        //TODO
        //hide or show form
        //initialize validation if needed
        //EXTRA CREDIT
        //Use the formTemplate to render the form like you do the list
        let dataToShow = null;
        if (id) {
            dataToShow = this.viewModel.data.find(d => d.id === id); 
        }
        $('#modal-submit').show();
        const template = await this.templateHTML('js/views/templates/formTemplate.html');
        const infoTemplate = _.template(template);
        $('#info-template').html(infoTemplate({ view: this, data: dataToShow  })); 
        $('#exampleModal').modal('show');
        if (id) {
            $('#modalLabel').text(this.viewModel.form.editFormTitle);
        } else {
            $('#modalLabel').text(this.viewModel.form.createFormTitle);
        }
        const form = document.getElementById(this.viewModel.form.id);
        
        if (form.attachEvent) {
            form.attachEvent("submit", this.submit);
        } else {
            form.addEventListener("submit", this.submit);
        }
        $('#modal-submit').on('click', () => { this.submit({target: document.getElementById(this.viewModel.form.id)})});
        $('.form-control').change(this.change);
    }

    getObjectValue (baseObj, arrKeys) {
        let obj = baseObj;
        for (const key of arrKeys) {
            if (!obj || typeof obj[key] === 'undefined') {
                return null;
            } else {
                obj = obj[key];
            }
        }
        return obj;
    }

    submit = (ev = null) => { // we use an arrow function so that 'this' still relates to the class, and not the item that got the event.

    if (ev.preventDefault) ev.preventDefault();
    const submitObj = {};
    for (const child of ev.target.children) {
        const childInputElem = $(child).find('.form-control').get(0);
        if (childInputElem) {
            this.change({target: childInputElem});
            submitObj[$(childInputElem).attr('name')] = $(childInputElem).val();
        }
    }
    if (ev.target.checkValidity()) {
        if (submitObj.id) {
            this.storage.update(submitObj.id, submitObj).then(() => {
                this.notifyMe(`Form sucessfully submitted!`);
                this.renderList();
            }).catch((e) => {
                this.notifyMe("Something went wrong updating the form", true);
                console.error(e);
            }).finally(() => {
                $('#exampleModal').modal('hide');
            });
        } else {
            this.storage.create(submitObj).then(() => {
                this.notifyMe(`Form sucessfully submitted!`);
                this.renderList();
            }).catch((e) => {
                this.notifyMe("Something went wrong updating the form", true);
                console.error(e);
            }).finally(() => {
                $('#exampleModal').modal('hide');
            });
        }
        
    }
        //TODO
        //stop propagation
        //validate form
        //if form is not valid, display errors
        //if valid, get form contents (jquery serializeArray)
        //call this.storage.update(this.currentItemId, submitData)
        //hide the form and show the list
        //re-render the list by calling 'this.renderList();'
    }

    displayErrorMessage(elem, message) {
        $(elem).parent().find('.error-message').text(message).show();
    }

    hideErrorMessage(elem) {
        $(elem).parent().find('.error-message').hide();
    }

    change = ev => {
        //TODO
        //called 'onChange' and you should validate the field at this point
        let curField = $(ev.target); //note you can get the changed Dom element from the 'target' attribute on the 'event' object
        const fieldName = curField.attr('name');
        const fieldSettings = this.viewModel.fields.find(v => v.name === fieldName);

        if (fieldSettings) {
            if (fieldSettings.validation) {
                const validation = fieldSettings.validation;
                const value = curField.val();
                if (validation.required) {
                    if (!value || value === "0") {
                        const message = validation.requiredMessage || "Field is required";
                        ev.target.setCustomValidity(message);
                        this.displayErrorMessage(ev.target, message);
                        return;
                    }
                }
                if (validation.regex) {
                    const regex = validation.regex;
                    if (!regex.test(value)) {
                        const message = validation.invalidMessage || "Field is invalid";
                        ev.target.setCustomValidity(message);
                        this.displayErrorMessage(ev.target, message);
                        return;
                    }
                }
            }
        } 
        this.hideErrorMessage(ev.target);
        ev.target.setCustomValidity('');
    }
    //TODO - VALIDATION CODE FROM LMS2
    // You should port your validation code into this class. Generic functions should stay here in parent class
    // If you have player or team specific code, you should override the functions you define here in the Team and Player classes
    // and implement them there.
    // To make things simpler, you could iterate the viewModel for each type and simply validate based on the rules
    // in the viewModel

    //UTILITY FUNCTIONS
    async templateHTML(template) { //get list template html
        return await $.get(template);
    }

    async populateLookups() {
        //iterate through viewmodel fields and call your REST API to populate the lookups your views will use.
        for (let field of this.viewModel.fields) {
            if ("lookupName" in field) {
                await this.storage.getLookup(field.lookupName);
            }
        }
        await this.storage.getLookup(this.viewModel.form.lookupName);
    }

    getFieldValue(fieldView, fieldData, label = false) {
        //get the field value using the viewModel.
        //if the field is a select box (has 'lookupName' in field view model), get the selected value
        //'label' boolean determines whether you want the actual display name, or the value of the selected item.
        if ("lookupName" in fieldView) {
            let data = _.find(this.storage.lookups[fieldView.lookupName], { value: fieldData[fieldView.name] });
            if (data === undefined)
                return null;
            else {
                return label ? data.label : data.value;
            }
        }
        else { //field is just an input, return the value of the field.
            return fieldData[fieldView.name];
        }
    }
} //end of class