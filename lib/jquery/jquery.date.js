/*
date v.0.0.1
Zurisadai Pavon
Copyright (c) 2012 
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/

(function($){


	var core = {

        // Some common format strings
        masks : {
            "default":      "ddd mmm dd yyyy HH:MM:ss",
            shortDate:      "m/d/yy",
            mediumDate:     "mmm d, yyyy",
            longDate:       "mmmm d, yyyy",
            fullDate:       "dddd, mmmm d, yyyy",
            shortTime:      "h:MM TT",
            mediumTime:     "h:MM:ss TT",
            longTime:       "h:MM:ss TT Z",
            isoDate:        "yyyy-mm-dd",
            isoTime:        "HH:MM:ss",
            isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
            isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
        },

        // Internationalization strings http://tools.ietf.org/html/rfc4646
        i18n : {
    
            'en' : {
            
                    dayNames: [
                        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat","Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
                    ],
                    monthNames: [
                        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec","January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
                    ]
            },
    
            'es' : {
            
                    dayNames: [
                        "Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab","Domingo", "Lunes", "Martes", "Mi&eacute;coles", "Jueves", "Viernes", "S&aacute;bado"
                    ],
                    monthNames: [
                        "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic","Enero[lang]", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                    ]
            }
        },
        
        token : /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        
        timezone : /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        
        timezoneClip : /[^-+\dA-Z]/g,
        
        pad : function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        }
	};
	
	var settings = {
	
        lang : (function(){
        
            var lang = window.navigator.language;
            if (lang == null) {
                // -- IE --
	            lang = window.navigator.userLanguage;
	            if (lang == null)
		            lang = "en";
            }
            
            return lang.substring(0, 2);

        })()
       
	};
	
	var methods = {
	
	    format : function(mask,utc){
	    
	        mask = String(core.masks[mask] || mask || core.masks["default"]);

            // Allow setting the utc argument via the mask
            if (mask.slice(0, 4) == "UTC:") {
                mask = mask.slice(4);
                utc = true;
            }
            
            date = new Date;
            lang = settings.lang;

            var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d:    d,
                dd:   core.pad(d),
                ddd:  ((typeof core.i18n[lang] != 'undefined') ?  
                core.i18n[lang].dayNames[D] : core.i18n['en'].dayNames[D]),
                dddd: ((typeof core.i18n[lang] !== 'undefined') ?
                core.i18n[lang].dayNames[D+7] : core.i18n['en'].dayNames[D+7]),
                m:    m + 1,
                mm:   core.pad(m + 1),
                mmm:  ((typeof core.i18n[lang] !== 'undefined') ?
                core.i18n[lang].monthNames[m] : core.i18n['en'].monthNames[m]),
                mmmm: ((typeof core.i18n[lang] !== 'undefined') ?
                core.i18n[lang].monthNames[m+12] : core.i18n['en'].monthNames[m+12]),
                yy:   String(y).slice(2),
                yyyy: y,
                h:    H % 12 || 12,
                hh:   core.pad(H % 12 || 12),
                H:    H,
                HH:   core.pad(H),
                M:    M,
                MM:   core.pad(M),
                s:    s,
                ss:   core.pad(s),
                l:    core.pad(L, 3),
                L:    core.pad(L > 99 ? Math.round(L / 10) : L),
                t:    H < 12 ? "a"  : "p",
                tt:   H < 12 ? "am" : "pm",
                T:    H < 12 ? "A"  : "P",
                TT:   H < 12 ? "AM" : "PM",
                Z:    utc ? "UTC" : (String(date).match(core.timezone) || [""]).pop().replace(core.timezoneClip, ""),
                o:    (o > 0 ? "-" : "+") + core.pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

            return mask.replace(core.token, function ($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
            });
	    }
	
	}

	$.date = function(method,mask,utc) {

        
       //If the first argument is the name of a function
        if(methods[method])
        {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
        //If not arguments or only one which is an object({...})
        else if(typeof method === 'undefined')
        {   //console.log('(typeof arguments[0] === object) OR (arguments[0] is undefined)');
			//return methods.init.apply(this, arguments);
			
			return new Date().toString();
		}
        else
        {
			$.error('The argument given: ' + method + ' does not work in $.bapp');
		}
		
	};

})(jQuery);
