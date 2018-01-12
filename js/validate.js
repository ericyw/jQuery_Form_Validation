$( function () {
               
               $( "input[class*=:required]" ).after( "<span> *</span>" );
                
            } );
            
            Vanadium.config = {
            
                valid_class: "rightformcss",
                invalid_class: "failformcss",
                message_value_class: "msgvaluecss",
                advice_class: "failmsg",
                prefix: ":",
                separator: ";",
                reset_defer_timeout: 100
            };

            Vanadium.Type = function( className, validationFunction, error_message, message, init ) {

                this.initialize( className, validationFunction, error_message, message, init );
            }

            Vanadium.Type.prototype = {

                    initialize: function ( className, validationFunction, error_message, message, init ) {

                        this.className = className;
                        this.validationFunction = validationFunction;
                        this.error_message = error_message;
                        this.message = message;
                        this.init = init;
                    },

                    test: function ( value ) {

                        return this.validationFunction.call( this, value );
                    },
                   
                    validMessage: function () {

                        return this.message;
                    },

                    invalidMessage: function() {

                        return this.error_message;
                    },

                    toString: function() {

                        return "className: " + this.className + " message: " + this.message + " error_message: " + this.error_message;
                    },

                    init: function ( parameter ) {

                        if ( this.init ) {

                            this.init( parameter );
                        }
                    }
                };

            Vanadium.setupValidatorTypes = function () {

                    Vanadium.addValidatorType( "empty", function ( v ) {

                        return ( ( v === null ) || ( v.length === 0 ) );
                    });


                    Vanadium.addValidatorTypes([

                        [ "equal", function ( v, p ) { 

                            return v == p;

                        }, function ( _v, p ) {

                            return "Input must match <span class='" + Vanadium.config.message_value_class + "'>" + p + "\(case-sensitive\)</span>";     
                        }],

                        [ "equal_ignore_case", function ( v, p ) {

                            return v.toLowerCase() == p.toLowerCase();

                        }, function ( _v, p ) {

                            return "Input must return <span class='" + Vanadium.config.message_value_class + "'>" + p + "\(case-insensitive\)</span>";
                        }],
                       
                        [ "required", function( v ) {

                            return !Vanadium.validators_types[ "empty" ].test( v );

                        }, "Input cannot be empty" ],
    
                        ["accept", function ( v, _p, e ) {

                            return e.element.checked;
                        }, "Must accept!"],

                        ["integer", function ( v ) {

                            if ( Vanadium.validators_types['empty'].test( v ) ) 
                                return true;

                            var f = parseFloat( v );

                            return ( !isNaN( f ) && f.toString() === v && f === Math.round( f ) );

                        }, "Please enter a whole integer."],                        
                        
                        ["number", function ( v ) {

                            return Vanadium.validators_types[ "empty" ].test( v ) || ( !isNaN( v ) && !/^\s+$/.test( v ) );

                        }, "Please enter a number."],

                        ["digits", function ( v ) {

                            return Vanadium.validators_types[ "empty" ].test( v ) || !/[^\d]/.test( v );
   
                        }, "Please enter a non-nagetive number"],

                        ["alpha", function ( v ) {

                            return Vanadium.validators_types[ "empty" ].test( v ) || /^[a-zA-Z\u00C0-\u00FF\u0100-\u017E\u0391-\u03D6]+$/.test( v );    
                            
                        }, "Please enter letters."],
                       
                        ["asciialpha", function ( v ) {
                        
                            return Vanadium.validators_types[ "empty" ].test( v ) || /^[a-zA-Z]+$/.test( v );
                             
                        }, "Please enter letters of ASCII."],
   
                        [ "alphanum", function( v ) {

                             return Vanadium.validators_types[ "empty" ].test( v ) || !/\W/.test( v );

                        }, "Please enter letters or non-negative number!"],
                        
                        ['email', function( v ) {

                            return ( Vanadium.validators_types["empty"].test( v ) || /\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/.test(v) );

                        }, 'Please enter correct format, for example: example@gmail.com'],
                    
                        ['url', function( v ) {

                            return Vanadium.validators_types[ "empty" ].test( v ) ||
                                    /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i.test( v );

                        }, 'Please enter correct format, for example: http://www.google.com'],
                        
                        ["date_au", function ( v ) {         
                     
                            if ( Vanadium.validators_types[ "empty" ].test( v ) )
                                return true;
                            
                            var regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
                            
                            if ( !regex.test( v ) ) return false;
                            
                            var d = new Date( v.replace( regex, "$2/$1/$3" ) );
                            
                            return ( parseInt( RegExp.$2, 10 ) == ( 1 + d.getMonth() ) ) &&
                                   ( parseInt( RegExp.$1, 10 ) == d.getDate() ) &&
                                   ( parseInt( RegExp.$3, 10 ) == d.getFullYear() );    
                        }, 'Please enter correct format, for example: mm/dd/yyyy, or dd/mm/yyyy.'],
                            
                        [ 'length',

                            function( v, p ) {

                                if ( p === undefined ) {

                                    return true;

                                } else {

                                    return v.length == parseInt( p );
                                } 
                            },

                            function ( _v, p ) {

                                return 'Input length is <span class="' + 
                                        Vanadium.config.message_value_class + '">' +
                                        p + '</span>.';
                            }
                        ],

                        //
                        ['min_length',

                            function ( v, p ) {

                                if (p === undefined) {

                                    return true;

                                } else {

                                    return v.length >= parseInt(p)
                                }
                            },

                            function ( _v, p ) {

                                return 'Input length shouldn\'t be less than <span class="' + 
                                        Vanadium.config.message_value_class + '">' + p + '</span>.'
                            }
                        ],

                        [ 'max_length',

                            function( v, p ) {

                                if ( p === undefined ) {

                                    return true;

                                } else {

                                    return v.length <= parseInt( p );
                                }
                            },

                            function( _v, p ) {

                                return 'Input length shouldn\'t be longer than <span class="' + 
                                        Vanadium.config.message_value_class + '">' + p + '</span>.';
                            }
                        ],

                        ['same_as',  

                            function( v, p ) {

                                if ( p === undefined ) {

                                    return true;

                                } else {

                                    var exemplar = document.getElementById( p );

                                    if ( exemplar ) 
                                        return v == exemplar.value;

                                    else
                                        return false;
                                }
                            },

                            function( _v, p ) {

                                var exemplar = document.getElementById( p );

                                if ( exemplar ) {

                                    return "Password doesn't match.";

                                } else {    

                                    return "There is no reference value!";
                                }
                            },

                            "",

                            function( validation_instance ) {

                                var exemplar = document.getElementById( validation_instance.param );

                                if ( exemplar ) {

                                  jQuery( exemplar ).bind( 'validate' , function() {

                                        jQuery( validation_instance.element ).trigger( 'validate' ); 
                                  });  
                                } 
                            }
                        ],

                        ['ajax',

                            function( v, p, validation_instance, decoration_context, decoration_callback ) {

                                if ( Vanadium.validators_types['empty'].test( v ) ) {

                                    return true;
                                }
                                if ( decoration_context && decoration_callback ) {

                                    jQuery.getJSON( p, { value: v, id: validation_instance.element.id }, function ( data ) {

                                        decoration_callback.apply( decoration_context, [ [data], true ] );
                                    });    
                                }
                                return true;
                        }],

                        ['format',
                            function( v, p ) {

                                var params = p.split( "/" );        
                                var params2 = v.split( "/" );
                                
                                if ( params.length === 3 || params[0] === "" ) {

                                    var pattern = params[1];
                                    var attributes = params[2];
                                    
                                    var patt = params2[1];
                                    var att = params2[2];
                                   
                                        return ( pattern === patt && attributes === att );
                                        
                                } else {

                                    return false;
                                }
                            },  
                            function ( _v, p ) {

                                return "Input must match <span class='" +
                                    Vanadium.config.message_value_class + "'>" + p.toString() + "</span>.";
                            }
                        ]
                    ]);

                    if ( typeof ( VanadiumCustomValidationTypes ) !== "undefined" &&
                            VanadimCustomValidationTypes ) {

                        Vanadium.addValidatorTypes( VanadiumCustomValidationTypes ); 
                    }
                };