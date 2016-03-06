$(document).ready(function () {
    var baseUrl = 'https://baas.kinvey.com/appdata/',
        appId = 'kid_-y8QPlSb1-',
        restAPI = 'SXZvOjEyM3Bhc3MxMjNwYXNz',
        country = 'Country',
        town = 'Town',
        result = [],
        countryName,
        add,
        remove,
        edit,
        list,
        addTown,
        removeTown,
        editTown;

    loadCountries();

    function loadCountries() {
        $.ajax({
            method : 'GET',
            headers: {
                'Authorization' : 'Basic ' + restAPI,
                'X-Kinvey-API-Version' : '3'
            },
            url: baseUrl + appId + '/' + country + '/',
            success: countryLoaded,
            error: error
        });
    }

    function countryLoaded(data) {
        var tbody = $('#tbody'),
            index,
            countreyName,
            text,
            id;

        for (index in data) {
            countreyName =  data[index].name;
            id = data[index]._id;
            sessionStorage[countreyName] = id;
            result.push(countreyName);
        }

        for (index in result) {
            text = result[index];
            tbody.append('<tr><td>' + text +'</td></tr>');
        }
    }

    function error() {
        alert('Cannot load AJAX data.');
    }

    function reload() {
        location.reload();
    }

    add = $('#add-country').on('click', function addACountry() {
        countryName = $('#countryName').val();
        $.ajax({
            method: 'POST',
            headers: {
                'Authorization' : 'Basic ' + restAPI,
                'X-Kinvey-API-Version' : '3'
            },
            contentType: 'application/json',
            data: JSON.stringify({
                "name": countryName
            }),
            url: baseUrl + appId + '/' + country + '/',
            success: reload,
            error: error
        })
    });

    remove = $('#delete-country').on('click', function removeACountry() {
        countryName = $('#countryName').val();

        $.ajax({
            method: 'DELETE',
            headers: {
                'Authorization' : 'Basic ' + restAPI,
                'X-Kinvey-API-Version' : '3'
            },
            url: baseUrl + appId + '/' + country + '/' + '?query={"name":"' + countryName + '"}',
            success: reload,
            error: error
        })
    });

    edit = $('#edit-countrys').on('click', function editACountry() {
        var newCountryName;

        countryName = $('#countryName').val();
        newCountryName = prompt('Rename country: ', countryName) || countryName;

        $.ajax({
            method: "PUT",
            headers: {
                'Authorization' : 'Basic ' + restAPI,
                'X-Kinvey-API-Version' : '3'
            },
            data: JSON.stringify({
                "name": newCountryName
            }),
            contentType: "application/json",
            url: baseUrl + appId + '/' + country + '/' + sessionStorage[countryName],
            success: reload,
            error: error
        //    "NetworkError: 401 Unauthorized - I do not know why it happents
        });
    });

    list = $('#list-towns').on('click', function listTowns() {
        var table = $('#town-table');
        countryName = $('#countryName').val();

        loadTowns();

        function loadTowns() {
            $.ajax({
                method : 'GET',
                headers: {
                    'Authorization' : 'Basic ' + restAPI,
                    'X-Kinvey-API-Version' : '3'
                },
                url: baseUrl + appId + '/' + town + '/',
                success: townsLoaded,
                error: error
            });

            function townsLoaded(data) {
                var tbody = $('#town-tbody'),
                    townArray = [],
                    townName,
                    countryBelongs,
                    index,
                    text,
                    id;

                for (index in data) {
                    townName = data[index].name;
                    countryBelongs = data[index].country;
                    id = data[index]._id;
                    sessionStorage[townName] = id;

                    if (countryBelongs === countryName) {
                        townArray.push(townName);
                    }
                }

                if (townArray.length !== 0) {
                    table.css('display', 'table');
                }

                for (index in townArray) {
                    text = townArray[index];
                    tbody.append('<tr><td>' + text +'</td></tr>');
                }
            }
        }
    });

    addTown = $('#add-town').on('click', function addATown() {
        var townName = $('#town-name').val(),
            countryBelongs = $('#coutry-belongs').val();

        $.ajax({
            method: 'POST',
            headers: {
                'Authorization' : 'Basic ' + restAPI,
                'X-Kinvey-API-Version' : '3'
            },
            contentType: 'application/json',
            data: JSON.stringify({
                "name": townName,
                "country": countryBelongs
            }),
            url: baseUrl + appId + '/' + town + '/',
            success: reload,
            error: error
        })
    });

    removeTown = $('#delete-town').on('click', function removeTown() {
        var townName = $('#town-name').val(),
            countryBelongs = $('#coutry-belongs').val();

        $.ajax({
            method: 'DELETE',
            headers: {
                'Authorization' : 'Basic ' + restAPI,
                'X-Kinvey-API-Version' : '3'
            },
            url: baseUrl + appId + '/' + town + '/' + '?query={"name":"' + townName + '","country":"' + countryBelongs + '"}',
            success: reload,
            error: error
        })
    });

    editTown = $('#edit-town').on('click', function editTown() {
        var townName = $('#town-name').val(),
            newTownName = prompt('Enter a new town name for: ', townName) || townName;
            countryBelongs = $('#coutry-belongs').val();

        $.ajax({
            method: 'PUT',
            headers: {
                'Authorization' : 'Basic ' + restAPI,
                'X-Kinvey-API-Version' : '3'
            },
            contentType: 'application/json',
            data: JSON.stringify({
                'name': newTownName,
                'country': countryBelongs
            }),
            url: baseUrl + appId + '/' + town + '/' + sessionStorage[townName],
            success: reload,
            error: error
        })
    });
});