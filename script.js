let defaultProperties = {
    text: "",
    "font-weight": "",
    "font-style": "",
    "text-decoration": "",
    "text-align": "left",
    "background-color": "#ffffff",
    "color": "#000000",
    "font-family": "Calibri",
    "font-size": "14px"
}

let cellData = {
    "Sheet1" : {}
}

let selectedSheet = "Sheet1";
let totalSheets = 1;
$(document).ready(function() {

    for (let i = 1; i <= 100; i++) {
        
        let ans = getCodeFromNumber(i);

        let column = `<div class="column-name colId-${i}" id="colCod-${ans}">${ans}</div>`;
        $(".column-name-container").append(column);

        let row = `<div class="row-name" id="rowId-${i}">${i}</div>`;
        $(".row-name-container").append(row);
    }

    // generates cells
    for(let i = 1; i<=100; i++){
        let cellRow = $(`<div class="cell-row"></div>`);
        let colCode = $(`.colId-${i}`).attr(`id`).split('-')[1];

        for(let j = 1; j<=100; j++){
            let cellcolumn = $(`<div class="input-cell" contenteditable="false" id="row-${i}-col-${j}" data="${colCode}"></div>`);
            cellRow.append(cellcolumn);
        }

        $('.input-cell-container').append(cellRow);

    }
    
    
    // click event listener for selector

    $(".align-icons").click(function(){
        $(".align-icons.selected").removeClass("selected");
        $(this).addClass("selected");
    });

    $(".style-icon").click(function(){
        $(this).toggleClass("selected");
    });

    $(".input-cell").click(function(event){
        [rowId, colId] = getRowColId(this);
        if(event.ctrlKey){
            [rowId, colId] = getRowColId(this);

            if(rowId > 1){
                let topcellselected = $(`#row-${rowId-1}-col-${colId}`).hasClass("selected");
                if(topcellselected){
                    $(this).addClass("top-cell-selected");
                    $(`#row-${rowId-1}-col-${colId}`).addClass("bottom-cell-selected");
                }
            }

            if(rowId < 100){
                let bottomcellselected = $(`#row-${rowId+1}-col-${colId}`).hasClass("selected");
                if(bottomcellselected){
                    $(this).addClass("bottom-cell-selected");
                    $(`#row-${rowId+1}-col-${colId}`).addClass("top-cell-selected");
                }
            }

            if(colId > 1){
                let leftcellselected = $(`#row-${rowId}-col-${colId-1}`).hasClass("selected");
                if(leftcellselected){
                    $(this).addClass("left-cell-selected");
                    $(`#row-${rowId}-col-${colId-1}`).addClass("right-cell-selected");
                }
            }

            if(colId < 100){
                let rightcellselected = $(`#row-${rowId}-col-${colId+1}`).hasClass("selected");
                if(rightcellselected){
                    $(this).addClass("right-cell-selected");
                    $(`#row-${rowId}-col-${colId+1}`).addClass("left-cell-selected");
                }
            }
        }
        else{
            $(".input-cell.selected").removeClass("selected top-cell-selected bottom-cell-selected right-cell-selected left-cell-selected");
        }

        $(this).addClass("selected");

        // console.log(getCodeFromNumber(colId) + rowId);
        $('.cell-name-box').empty();
        $('.cell-name-box').append(getCodeFromNumber(colId) + rowId);

        changeHeader(this);

    });


    // Too way header change


    function changeHeader(element){
        // console.log(getRowColId(element));
        [rowId, colId] = getRowColId(element);
        let cellInfo = defaultProperties;

        if(cellData[selectedSheet][rowId] && cellData[selectedSheet][rowId][colId]){
            cellInfo = cellData[selectedSheet][rowId][colId];
        }

        cellInfo["font-weight"] ? $(".icon-bold").addClass("selected") : $(".icon-bold").removeClass("selected");
        cellInfo["font-style"] ? $(".icon-italic").addClass("selected") : $(".icon-italic").removeClass("selected");
        cellInfo["text-decoration"] ? $(".icon-underline").addClass("selected") : $(".icon-underline").removeClass("selected");

        let alignment = cellInfo['text-align'];
        $('.align-icons').removeClass('selected');
        $(`.icon-align-${alignment}`).addClass('selected');


        $('.background-color-picker').val(cellInfo['background-color']);
        $('.font-color-picker').val(cellInfo['color']);

        $('.font-family-selector').val(cellInfo['font-family']);
        $('.font-family-selector').css("font-family", cellInfo['font-family']);
        $('.font-size-selector').val(cellInfo['font-size']);



    }



    $(".input-cell").dblclick(function(){
        $(".input-cell.selected").removeClass("selected");
        $(this).addClass("selected");
        $(this).attr("contenteditable", "true");
        $(this).focus();

    });
    
    $(".input-cell").blur(function(){
        $(this).attr("contenteditable", "false");
    });

    $(".input-cell-container").scroll(function(){
        $(".column-name-container").scrollLeft(this.scrollLeft);
        $(".row-name-container").scrollTop(this.scrollTop);
    });

});

function getCodeFromNumber(n){
    let ans = "";
    while (n > 0) {

        let rem = n % 26;
        if (rem == 0) {
            ans = "Z" + ans;
            n = Math.floor(n / 26) - 1;
        }
        else {
            ans = String.fromCharCode(rem - 1 + 65) + ans;
            n = Math.floor(n / 26);
        }
    }
    return ans;
}

function getRowColId(e){
    let id = $(e).attr("id").split("-");
    return [parseInt(id[1]), parseInt(id[3])];
}



function updateCell(property, value, defaultPossible){
    $(".input-cell.selected").each(function(){
        $(this).css(property, value);

        const [rowId, colId] = getRowColId(this);

        if(cellData[selectedSheet][rowId]){
            if(cellData[selectedSheet][rowId][colId]){
                cellData[selectedSheet][rowId][colId][property] = value;
            }
            else{
                cellData[selectedSheet][rowId][colId] = {...defaultProperties};
                cellData[selectedSheet][rowId][colId][property] = value;
            }
        }else{
            cellData[selectedSheet][rowId] = {};
            cellData[selectedSheet][rowId][colId] = {...defaultProperties};
            cellData[selectedSheet][rowId][colId][property] = value;
        }   

        if( (defaultPossible) && (JSON.stringify(cellData[selectedSheet][rowId][colId]) === JSON.stringify(defaultProperties)) ){
            delete cellData[selectedSheet][rowId][colId];
            if(Object.keys(cellData[selectedSheet][rowId]).length == 0){
                delete cellData[selectedSheet][rowId];
            }
        }

        console.log(cellData);
    });


    
}



$(".icon-bold").click(function(){
    if($(this).hasClass("selected")){
        updateCell("font-weight", "", true)
    }
    else{
        updateCell("font-weight", "bold", false)
    }
});

$(".icon-italic").click(function(){
    if($(this).hasClass("selected")){
        updateCell("font-style", "", true)
    }
    else{
        updateCell("font-style", "italic", false)
    }
});


$(".icon-underline").click(function(){
    if($(this).hasClass("selected")){
        updateCell("text-decoration", "", true)
    }
    else{
        updateCell("text-decoration", "underline", false)
    }
});


$('.icon-align-left').click(function(){
    if(!$(this).hasClass('selected')){
        updateCell("text-align", 'left', true);
    }

});

$('.icon-align-center').click(function(){
    if(!$(this).hasClass('selected')){
        updateCell("text-align", 'center', true);
    }

});

$('.icon-align-right').click(function(){
    if(!$(this).hasClass('selected')){
        updateCell("text-align", 'right', true);
    }

});



$('.color-fill-icon').click(function(){
    $('.background-color-picker').click();
});

$('.text-color-fill-icon').click(function(){
    $('.font-color-picker').click();
});

$('.font-color-picker').change(function(){
    updateCell("color", $(this).val());
});

$('.background-color-picker').change(function(){
    updateCell("background-color", $(this).val());
});



$('.font-family-selector').change(function(){
    updateCell("font-family", $(this).val(), true);
    $('.font-family-selector').css("font-family", $(this).val());
});

$('.font-size-selector').change(function(){
    updateCell("font-size", $(this).val(), true);
});