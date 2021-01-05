
var currCents = 0;

$(document).ready(function() {
    loadVendables();
});

function loadVendables() {
    $.ajax({
        type: 'GET',
        url: 'http://tsg-vending.herokuapp.com/items',
        success: function(vendables) {
            $('#vendingDisplay').empty();
            $.each(vendables, function(index, item) {
                addVendable(index, item);
            });
        }
    })
}

function addVendable(index, data) {
    var entry = '<div class="card mb-3 text-center" style="width: 30%;">';
        entry += '<div class="card-header p-1">';
            entry += '<div>#' + data.id + '</div>';
            entry += '<div class="w-100"><b>' + data.name + '</b></div>';
        entry += '</div>';
        entry += '<div class="card-body py-2">';
            entry += '<p>' + getCashString(data.price) + '</p>';
            entry += '<p>Quantity: ' + data.quantity + '</p>';
        entry += '</div>';
    entry += '</div>';
    $('#vendingDisplay').append(entry);
}

function buyVendable() {
    $.ajax({
        type: 'POST',
        url: 'http://tsg-vending.herokuapp.com/money/' + currCents / 100  + '/item/' + $('#itemId').val(),

        success: function(change) {
            displayChange(change);
            loadVendables();
            currCents = 0;
            $('#infoMessages').text('Thank You!!!');
        },

        error: function(xhr) {
            $('#infoMessages').text(xhr.responseJSON.message);
        }
    })
}

function addCents(amt) {
    currCents += amt;
    $('#cashTotal').text(getCashString(currCents / 100));
}

function getChange() {
    var coinValue = {
        'dollars': 100,
        'quarters': 25,
        'dimes': 10,
        'nickels': 5,
        'pennies': 1
    };
    var refund = {};

    for (var coin in coinValue) {
        var amt = Math.floor(currCents / coinValue[coin]);
        currCents = currCents % coinValue[coin];
        (amt > 1) & (refund[coin] = amt);
    }

    displayChange(refund);
}

function displayChange(change) {
    var pluralToSingular = {
        'dollars': 'dollar',
        'quarters': 'quarter',
        'dimes': 'dime',
        'nickels': 'nickel',
        'pennies': 'penny'
    };

    var refund = [];
    for (var coin in change) {
        if (change[coin] > 1) {
            refund.push(getCapitalized(coin) + ': ' + change[coin]);
        } else if (change[coin] > 0) {
            refund.push(getCapitalized(pluralToSingular[coin]) + ': ' + change[coin]);
        }
    }

    var output = refund.length === 0 ? 'No change!' : refund.join(', ');
    $('#changeMessage').text(output);

    currCash = 0;
    $('#cashTotal').text(getCashString(currCash));

}

function getCapitalized(str) {
    return str.replace(/^\w/, (c) => c.toUpperCase());
}

function getCashString(money) {
    return '$' + String(money.toFixed(2));
}
