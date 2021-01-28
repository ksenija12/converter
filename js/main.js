
    const buttonUser = $('.press-button');
    const result = $('.result');
    
    const buttonAdmin = $('.button_admin');
    const adminButton = $('.admin-button');
    const adminForm = $('.admin-form');
    const buttonRuleCancel = $('.button_rule-cancel');
    const converterForm = $('.converter-form');
    const addRuleButton = $('.button_rule-add');
    
    const placeValueUnitShot = $('#placeValueUnitShot');
    const placeValueUnitFull = $('#placeValueUnitFull');
    const placeValueCoefficient = $('#placeValueCoefficient');
    
$.getJSON("data.json").done( function(json) {
    if ((typeof json) != "object") {json = JSON.parse(json)};
    let valToMeter = {
        m: 1,
        cm: .01,
        in: .0254,
        ft: .3048,
        // mm: .001,
        // yd: .9144,
        // km: 1000,
        // mile: 1609.3
    };

    $(".get").text(`Вход: ${JSON.stringify(json)}`);
    let jsonResult = JSON.stringify(convertApp(json));
    
    $(".set").text(`Выход: ${jsonResult}`);
    

    $('#convertValueUnit').val(json.distance.unit);
    $('#convertValueNumber').val(json.distance.value );
    $('#convertValueUnitNew').val(json.convert_to);

    convertApp(json);

    let resultValue = $(".result__value");
    if (convertApp(json).value >= 0.01) {
        resultValue.text(convertApp(json).value)
    } else {
        resultValue.text("~ 0");
    }

    let resultValueSolution = $(".result__value-solution");
    if (convertApp(json).value >= 0.01) {
        resultValueSolution.text(`( ${roundTo(json.distance.value)} ${json.distance.unit} = ${convertApp(json).value} ${convertApp(json).unit} )`);
    } else {
        resultValueSolution.text() = resultValueSolution.text(`( ${roundTo(json.distance.value)} ${json.distance.unit} ~ 0 ${convertApp(json).unit} )`);
    }

    buttonUser.toggleClass("hideblock");
    result.toggleClass("hideblock");


    function roundTo(number, pow = 2) {
        let multiplier = Math.pow(10, pow);
        return Math.round(number * multiplier) / multiplier;
    };

    function convertApp(conv) {
        let newValueNum = roundTo(conv.distance.value * valToMeter[conv.distance.unit] / valToMeter[conv.convert_to]);
        let resultApp = {unit: conv.convert_to, value: newValueNum};
        return resultApp;
    }

    function addRule() {

        if (placeValueUnitShot.val() && placeValueUnitFull.val() && (placeValueCoefficient.val() != "")) {

            $("#convertValueUnit, #convertValueUnitNew").append(`<option value="${placeValueUnitShot.val()}">${placeValueUnitFull.val()}</option>`)

            valToMeter[placeValueUnitShot.val()] = Number(parseFloat(placeValueCoefficient.val()));
        }
    };

    function showResult(json) {
        
    }


    $('#convertValueUnit').on("input", function(){
        const target = $(this);
        if ($("#convertValueUnit").val() === $("#convertValueUnitNew").val() ) {
            $("#convertValueUnitNew").val("");
        }
        let convertValList = $("#convertValueUnitNew > option");
        convertValList.each(function(i, el) {
            if ($(el).val() === target.val()){
                $(el).toggleClass("hideblock");
            } else {
                if ($(el).hasClass("hideblock")) {$(el).toggleClass("hideblock")};
            }
            
        });
    });

    $(".convert-value__number, .place-value__coefficient").on("input", function() {
        $(this).val($(this).val().replace(/[^0-9.]/g, '').replace( /^([^\.]*\.)|\./g, '$1' ));
    });

    buttonUser.on("click", function(){
        const target = $(this);
        const unitVal = $('#convertValueUnit');
        const valueValReplace = $('#convertValueNumber');
        const convertVal = $('#convertValueUnitNew');
    
        if ((valueValReplace.val()) && (convertVal.val() != "")) {

            json.distance.unit = unitVal.val();
            json.distance.value = valueValReplace.val();
            json.convert_to = convertVal.val();

            $(".change").text(`Изменения: ${JSON.stringify(json)}`);
            $(".change").css('backgroundColor', '#ffffff');
            
            target.toggleClass("hideblock");
            result.toggleClass("hideblock");
            
            convertApp(json);
            jsonResult = JSON.stringify(convertApp(json));
            $(".set").text(`Выход: ${jsonResult}`);

            showResult(convertApp(json))

            let resultValue = $(".result__value");
            if (convertApp(json).value >= 0.01) {
                resultValue.text(convertApp(json).value)
            } else {
                resultValue.text("~ 0");
            }

            let resultValueSolution = $(".result__value-solution");
            if (convertApp(json).value >= 0.01) {
                resultValueSolution.text(`( ${roundTo(json.distance.value)} ${json.distance.unit} = ${convertApp(json).value} ${convertApp(json).unit} )`);
            } else {
                resultValueSolution.text() = resultValueSolution.text(`( ${roundTo(json.distance.value)} ${json.distance.unit} ~ 0 ${convertApp(json).unit} )`);
            }
            

        } else {
            alert("Ошибка введения данных");
        };

        
        
    });
    
    $('#convertValueUnit, #convertValueNumber, #convertValueUnitNew').on("click", function(){
        if (buttonUser.hasClass("hideblock")) {
            buttonUser.toggleClass("hideblock");
            result.toggleClass("hideblock");
        };
    });
    
    buttonAdmin.on("click", function(){
        adminButton.toggleClass('hideblock');    
        converterForm.toggleClass('hideblock');
        adminForm.toggleClass('hideblock');

        placeValueUnitShot.val('');
        placeValueUnitFull.val('');
        placeValueCoefficient.val('');
            
        if (!addRuleButton.hasClass("noactive")){
            addRuleButton.addClass("noactive");
        };
            
        
    });


    buttonRuleCancel.on("click", function(){
        converterForm.toggleClass('hideblock');
        adminForm.toggleClass('hideblock');
        adminButton.toggleClass('hideblock');

    });

    addRuleButton.on("click", function(){
        if (!addRuleButton.hasClass("noactive")){
            addRule();
            adminButton.toggleClass('hideblock');
            converterForm.toggleClass('hideblock');
            adminForm.toggleClass('hideblock');
        };
    });

    adminForm.on("input", function(){

        if (placeValueUnitShot.val() && placeValueUnitFull.val() && (placeValueCoefficient.val() != "")) {

            if (addRuleButton.hasClass("noactive")){
                addRuleButton.removeClass("noactive");
            };
        } else {
            if (!addRuleButton.hasClass("noactive")){
                addRuleButton.addClass("noactive");
            };
        }
    })

});