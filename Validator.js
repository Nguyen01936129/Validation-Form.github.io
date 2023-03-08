function Validator(options) {

    var selectorRules = {}
    formElement = document.querySelector(options.form)
        var validate = function (inputElement, rule) {
            var mess_err_element = inputElement.closest(options.closest_formGroup).querySelector(options.form_message)
            // get value from input
            var error_message;
            // console.log(selectorRules)
            var rules = selectorRules[rule.select];
            // console.log( rules)

            for( var i = 0; i < rules.length; i ++) {
                switch (inputElement.type) {
                    case  'radio':
                    case  'checkbox':
                        error_message = rules[i](
                            formElement.querySelector(rule.select + ':checked')
                        )
                        break;
                        default:
                            error_message = rules[i](inputElement.value);
                }
                // stop the loop to show error message
                if(error_message) break;
            }
            
            if(error_message) {
                inputElement.closest(options.closest_formGroup).classList.add('invalid')
                mess_err_element.innerText = error_message
            }
            else {
                inputElement.closest(options.closest_formGroup).classList.remove('invalid')
                mess_err_element.innerText = ''
                // error_message = false;
            }
            return !!error_message;
        }
    

        if(formElement) {
            //  console.log(options)
                if(formElement){
            // prevent sending value by default of the website when click submit button
                    formElement.onsubmit = function (e) {
                        e.preventDefault();
                        
                        var isValidForm = true;

                        options.rules.forEach(function(rule){
                            var inputElement = formElement.querySelector(rule.select)
                            var inValid = validate(inputElement, rule)
                            if(inValid) {
                                isValidForm = false;
                            }
                            
                        })                       

                        if(isValidForm) {
                            if(typeof options.onSubmit === 'function') {
                                // select all the input which has attribute is name and don't have attribute disable
                                var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')

                                 // console.log(enableInputs)
                                var formValues = Array.from(enableInputs).reduce(function(values, input) {

                                    switch(input.type) {
                                        case 'radio':
                                        case 'checkbox':
                                            if (!input.matches(':checked')) {
                                                if (!Array.isArray(values[input.name]))
                                                    values[input.name] = ''
                                                    return values
                                            }
                                            if (!Array.isArray(values[input.name])){
                                                values[input.name] = []
                                            }
                                            
                                            // values[input.name] = input.value
                                            
                                            values[input.name].push(input.value);
                                            break;
                                        default:
                                             values[input.name] = input.value


                                    }
                                    return values
                               }, {})

                               console.log(formValues)
                                // options.onSubmit(formValues)
                            }

                            else {
                                formElement.submit();
                            }
                            
                        }
                       
                    }

                    options.rules.forEach(function(rule){
                       var inputElements = formElement.querySelectorAll(rule.select)
                       Array.from(inputElements).forEach(function (inputElement) {
                        var mess_err_element = inputElement.closest(options.closest_formGroup).querySelector(options.form_message)
            
                        // handle when user blur the input
                        inputElement.onblur = function () {
                            validate(inputElement, rule)
                        }                                 
                        // handle when user type in the input 
                        inputElement.oninput = function (e) {
                            inputElement.closest(options.closest_formGroup).classList.remove('invalid')
                            mess_err_element.innerText = ''
                            
                        }
                       })
                       // console.log(inputElement)
                        // save rules for each input 
                        // checking it is an Array or not
                        // selectorRules[rule.select] = rule.test; save to object by this way
            
                        if(Array.isArray(selectorRules[rule.select])) {
                            selectorRules[rule.select].push(rule.test);
                        } else {
                            selectorRules[rule.select] = [rule.test];
                        }
            
                    });
                    // console.log(selectorRules)
                   }
                }

        }

Validator.isRequired = function(select) {
 return {
    select: select,
    test: function(value) {
        return value ? undefined : 'Require to fill'
    }
 }

}

Validator.isEmail = function(select) {
    return {
        select: select,
        test : function(value) {
           var regrex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
           return regrex.test(value) ? undefined : 'Please enter a valid email'
        }
    }
  
}

Validator.isMinlength = function(select, min) {
    return {
        select: select,
        test : function(value) {
           return value.length >= min ? undefined : `The length of password should be at least ${min} characters`
        }
    }
  
}

Validator.isConfirmed = function(select, getConfirm, message) {
    // console.log(select)
    return {
       select: select,
       test: function(value) {
           return value === getConfirm() ? undefined : message || 'The value is not match'
       }
    }
   
   }