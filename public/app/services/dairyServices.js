angular.module('dairyServices', [])
    .factory('Dairy', function ($http) {
        dairyFactory = {};

        dairyFactory.insertData = function () {
            return $http.post('/api/dairy');
        };

        dairyFactory.getData = function () {
            return $http.post('/api/dairiesList');
        };

        dairyFactory.processData = function (dairyData) {
            return $http.post('/api/dairiesMining', dairyData);
        };

        dairyFactory.getDairyProducts = function () {
            // dummy dairy products
            var products = [{
                id_item: 1,
                id_user: 1,
                type: 'olahan',
                name: 'susu murni A',
                price: 30000,
                description: 'susu enak dari pabrik A',
                img_src: 'assets/img/img0001.jpg'
            },
                {
                    id_item: 2,
                    id_user: 2,
                    type: 'olahan',
                    name: 'susu murni B',
                    price: 35000,
                    description: 'susu enak dari pabrik B',
                    img_src: 'assets/img/img0002.jpg'
                },
                {
                    id_item: 3,
                    id_user: 1,
                    type: 'ternak',
                    name: 'sapi A',
                    price: 8000000,
                    description: 'sapi sehat dari pabrik A',
                    img_src: 'assets/img/img0003.jpg'
                },
                {
                    id_item: 4,
                    id_user: 3,
                    type: 'olahan',
                    name: 'susu murni D',
                    price: 25000,
                    description: 'susu enak dari pabrik D',
                    img_src: 'assets/img/img0004.jpg'
                },
                {
                    id_item: 5,
                    id_user: 2,
                    type: 'ternak',
                    name: 'sapi B',
                    price: 9000000,
                    description: 'sapi sehat dari pabrik B',
                    img_src: 'assets/img/img0005.jpg'
                },
                {
                    id_item: 6,
                    id_user: 4,
                    type: 'ternak',
                    name: 'sapi E',
                    price: 7500000,
                    description: 'sapi sehat dari pabrik E',
                    img_src: 'assets/img/img0006.jpg'
                },
                {
                    id_item: 7,
                    id_user: 5,
                    type: 'olahan',
                    name: 'susu murni F',
                    price: 32000,
                    description: 'susu enak dari pabrik F',
                    img_src: 'assets/img/img0007.jpg'
                },
                {
                    id_item: 8,
                    id_user: 6,
                    type: 'olahan',
                    name: 'susu murni G',
                    price: 35000,
                    description: 'susu enak dari pabrik G',
                    img_src: 'assets/img/img0008.jpg'
                },
                {
                    id_item: 9,
                    id_user: 7,
                    type: 'olahan',
                    name: 'susu murni H',
                    price: 50000,
                    description: 'susu enak dari pabrik H',
                    img_src: 'assets/img/img0009.jpg'
                }];
            return products;
        };

        return dairyFactory;
    });