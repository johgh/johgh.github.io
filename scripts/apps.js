$(document).on('click', '#selectAll', function(e) {
    e.preventDefault();
    $(".check").prop('checked', true).trigger("change");
});

$(document).on('click', '#unselectAll', function(e) {
    e.preventDefault();
    $(".check").prop('checked', false).trigger("change");
});

$(document).on('click', '#selectSection', function(e) {
    e.preventDefault();
    $(".check:visible").prop('checked', true).trigger("change");
});

$(document).on('click', '#unselectSection', function(e) {
    e.preventDefault();
    $(".check:visible").prop('checked', false).trigger("change");
});

$(document).on('click', 'tr', function(e) {
    $(this).find('input').trigger('click');
});

$(document).on('click', '.check', function(e) {
    e.stopPropagation();
});

$(document).on('change', '.check', function() {
    var installCmd = '<span style="font-weight: normal">sudo apt-get install</span>';
    var numPackages = 0;
    var reposToAdd = [];
    $('.check:checked').each(function(){
        installCmd = installCmd + $(this).parent().text();
        repoName = $($(this)).parent().next().text();
        if (repoName != 'Distro') {
            reposToAdd.push(repoName);
        }
        numPackages = numPackages + 1;
    });
    var addReposCmd = '';
    $.each(unique(reposToAdd), function(index, repoToAdd) {
        addReposCmd = addReposCmd + '<span style="font-weight: normal">sudo add-apt-repository ' + repoToAdd + '</span><br />';
    });
    if (addReposCmd != '') {
        addReposCmd = addReposCmd + '<span style="font-weight: normal">sudo apt-get update</span><br />';
    }
    if (numPackages == 0) {
        installCmd = 'No packages selected';
        $('.selectButton').hide();
        $('div#numPackages').html('');
    } else {
        $('div#numPackages').html(numPackages + ' package/s selected');
        $('.selectButton').show();
    }
    $('#selectText').html(addReposCmd + installCmd);
});

function unique(list) {
    var result = [];
    $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}
$( document ).ready(function() {
    $('#pkgTable tr').each(function(){
        $(this).find('td:first').prepend('<input class="check" type="checkbox"></input> ');
    });

    $('table').addClass('tablesorter');
    $('table').tablesorter({
            theme : 'blue',
            sortList: [[2,0], [1,0], [0,0]],
            widgets: ["zebra", "filter"],
            widgetOptions : {
                // filter_functions : { 0: true, 1: true, 2 : true },
                filter_placeholder : { search : "Type 'Distro' or 'ppa'"},
                filter_reset: '.reset',
                filter_formatter : {
                    // default settings on first column
                    0 : function($cell, indx){
                        return $.tablesorter.filterFormatter.select2( $cell, indx, {
                                // *** select2 filter formatter options ***
                                cellText : '',    // Text (wrapped in a label element)
                                match    : true,  // adds "filter-match" to header & modifies search
                                value    : [],    // initial select2 values

                                // *** ANY select2 options can be included below ***
                                // (showing default settings for this formatter code)
                                multiple : true,  // allow multiple selections
                                width    : '100%', // reduce this width if you add cellText
                                closeOnSelect: false,
                                placeholder: "Search package"
                        });
                    },
                    // default settings on first column
                    // 1 : function($cell, indx){
                    //     return $.tablesorter.filterFormatter.select2( $cell, indx, {
                    //             // *** select2 filter formatter options ***
                    //             cellText : '',    // Text (wrapped in a label element)
                    //             match    : true,  // adds "filter-match" to header & modifies search
                    //             value    : [],    // initial select2 values

                    //             // *** ANY select2 options can be included below ***
                    //             // (showing default settings for this formatter code)
                    //             multiple : true,  // allow multiple selections
                    //             width    : '100%', // reduce this width if you add cellText
                    //             closeOnSelect: false
                    //     });
                    // },
                    // default settings on first column
                    2 : function($cell, indx){
                        return $.tablesorter.filterFormatter.select2( $cell, indx, {
                                // *** select2 filter formatter options ***
                                cellText : '',    // Text (wrapped in a label element)
                                match    : true,  // adds "filter-match" to header & modifies search
                                value    : [],    // initial select2 values

                                // *** ANY select2 options can be included below ***
                                // (showing default settings for this formatter code)
                                multiple : true,  // allow multiple selections
                                width    : '100%', // reduce this width if you add cellText
                                closeOnSelect: false,
                                placeholder: "Section"
                        });
                    }
                }
            }
    });
    $('.tablesorter-filter[type="search"]').css('height', '39px').css('width', '100%').css('font-size', '15pt');

});

