var playerViewModel= {
    list: {
        //You can use these as default options for your calls to your REST Service 'list' function
        options: {
            sort_col:"first_name",
            sort_dir:"asc",
            limit: null,
            offset:null,
            filter_col: null,
            filter_str: null,
            is_lookup:null,
            alt_table:null       
            },
        listButtonId: "playerButton",   //button id for players list, use while rendering list dynamicall
        listTitle: "Player List",    //title above list
        templateUrl: "js/views/templates/listTemplate.html",  //path to lodash template
        id: "player-list",
        tableClasses:"table table-striped"   //bootstrap classes to apply to my table
    },
    //The following can be used in rendering your form
    //dynamic rendering via lodash is recommended, but not required for the final
    form: {
        id: "my-form",
        addFormTitle: "Add Player",
        createFormTitle: "Create Player",
        deleteTitle: "Delete Player",
        editFormTitle: "Edit Player",
        actionUrl:"",
        method: "POST",
        lookupName: "players",
        suppressSubmit: true,
        templateUrl: "js/views/templates/formTemplate.html"
    },
    //Meta data for fields.  You can use for rendering your list dynamically.
    //if 'list' is true, then you should render this field in your list
    fields: [
        {
            label: "Id",
            name: "id",
            hidden: true,
            inputType: "hidden",
            list: true,
            validation: {
                required: false,
            }
        },
        {
            label: "First Name",
            name: "first_name",
            inputType: "text",
            placeholder: "Enter your first name here",
            list: true,
            value: null,
            //as you can see,this player meta data could easily be used to dynamically validate your form
            validation: {
                required: true,
                requiredMessage: "Last name is required!"
            }
        },
        {
            label: "Last Name",
            name: "last_name",
            inputType: "text",
            placeholder: "Enter your last name here",
            list: true,
            validation: {
                required: true,
                requiredMessage: "Last name is required!"
            }
        },
        {
            label: "Team",
            name: "team_id",
            inputType: "select",
            list:true,
            placeholder: "Select a Team",
            //lookupName is the table you will be using on the backend to return a list of 'options' for your
            //select box
            lookupName: "teams",
            validation: {
                required: true
            }
        },
        {
            label: "License Level",
            name: "license_level_id",
            inputType: "select",
            list:true,
            placeholder: "Select a License Level",
            //lookupName is the table you will be using on the backend to return a list of 'options' for your
            //select box
            lookupName: "licenses",
            validation: {
                required: true
            }
        },
        {
            label: "User Name",
            name: "user_name",
            inputType: "text",
            placeholder: "Enter your user name here",
            list: false,
            validation: {
                required: true,
                requiredMessage: "User name is required!"
            }
        },

        {
            label: "Address",
            name: "address1",
            inputType: "text",
            list: false,
            placeholder: "Enter your address name here",
            validation: {
                required: true,
                requiredMessage: "Address is required!"
            }
        },
        {
            label: "Address 2",
            name: "address2",
            inputType: "text",
            placeholder: "Enter your address name here",
            list: false,
            validation: {
                required: false
            }
        },
        {
            label: "City",
            name: "city",
            inputType: "text",
            placeholder: "Enter your city name here",
            list: false,
            validation: {
                required: true,
                requiredMessage: "City is required!"
            }
        },
        {
            label: "State",
            name: "state",
            inputType: "text",
            placeholder: "Enter your state name here",
            list: false,
            validation: {
                required: true,
                requiredMessage: "State is required!"
            }
        },
        {
            label: "Zip",
            name: "zip",
            inputType: "text",
            placeholder: "Enter your zip code here",
            list: false,
            validation: {
                required: true,
                requiredMessage: "Zip Code is required!",
                regex: /(^\d{5}$)|(^\d{9}$)|(^\d{5}-\d{4}$)/
            }
        },
        {
            label: "Email Address",
            name: "email",
            inputType: "email",
            placeholder: "Enter your email here",
            list: false,
            validation: {
                required: true,
                requiredMessage: "Email Address is required!",
                invalidMessage: "Invalid Email address",
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            }
        },
        {
            label: "Phone Number",
            name: "phone",
            inputType: "tel",
            placeholder: "Enter your phone number here",
            list: true,
            validation: {
                required: true,
                requiredMessage: "Phone Number is required!",
                invalidMessage: "Invalid Phone Number",
                regex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
            }
        },
        {
            label: "Password",
            name: "password",
            inputType: "password",
            placeholder: "Enter your Password",
            list: false,
            validation: {
                required: true,
                requiredMessage: "Password!",
                invalidMessage: "Invalid Password-must have 1 upper case, 1 lower case, 1 number, and min 8 chars",
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/im
            }
        },{
            label: "Notes",
            name: "notes",
            inputType: "text",
            placeholder: "Enter your Notes",
            list: false,
            validation: {
                required:false
            }
        },{
            label: "Person Type",
            name: "person_type",
            inputType: "text",
            placeholder: "",
            list: false,
            hidden: true,
            validation: {
                required:false
            }
        }
    
    ]
}