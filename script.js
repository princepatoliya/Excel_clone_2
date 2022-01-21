function generateCells() {
    for(let i = 1; i<=100; i++){
        let cellRow = $(`<div class="cell-row"></div>`);
        let colCode = $(`.colId-${i}`).attr(`id`).split('-')[1];

        for(let j = 1; j<=100; j++){
            let cellcolumn = $(`<div class="input-cell" contenteditable="false" id="row-${i}-col-${j}" data="${colCode}"></div>`);
            cellRow.append(cellcolumn);
        }

        $('.input-cell-container').append(cellRow);

    }
}

function getRowColId(e){
    let id = $(e).attr("id").split("-");
    return [parseInt(id[1]), parseInt(id[3])];
}

function updateCell(property, value){
    $(".input-cell.selected").each(function(){
        $(this).css(property, value);
    });
    
}

$(".icon-bold").click(function(){
    if($(this).hasClass("selected")){
        updateCell("font-weight", "")
    }
    else{
        updateCell("font-weight", "bold")
    }
});

$(".icon-italic").click(function(){
    if($(this).hasClass("selected")){
        updateCell("font-style", "")
    }
    else{
        updateCell("font-style", "italic")
    }
});


$(".icon-underline").click(function(){
    if($(this).hasClass("selected")){
        updateCell("text-decoration", "")
    }
    else{
        updateCell("text-decoration", "underline")
    }
});



$(document).ready(function() {

    for (let i = 1; i <= 100; i++) {
        let ans = ""
        let n = i;

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

        let column = `<div class="column-name colId-${i}" id="colCod-${ans}">${ans}</div>`;
        $(".column-name-container").append(column);

        let row = `<div class="row-name" id="rowId-${i}">${i}</div>`;
        $(".row-name-container").append(row);
    }

    // generates cells
    generateCells();
    
    
    // click event listener for selector

    $(".align-icons").click(function(){
        $(".align-icons.selected").removeClass("selected");
        $(this).addClass("selected");
    });

    $(".style-icon").click(function(){
        $(this).toggleClass("selected");
    });

    $(".input-cell").click(function(event){
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

            $(this).addClass("selected");

        }
        else{
            $(".input-cell.selected").removeClass("selected top-cell-selected bottom-cell-selected right-cell-selected left-cell-selected");
            $(this).addClass("selected");
        }
    });

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


