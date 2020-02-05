products.map((item) => {
    PP.findOne({no:item.productNo},function(err,pp){
        if(pp)
        {
         var  query = {
             _id:pp.id
         };
         var data = {};
         var vv = pp.value + 1;
         data.value = vv;
         PP.update(query,data,function(err){
             console.log('Updated successfully')
         })
        }
        else
        {
            var data = new PP();
            data.no = item.productNo;
            data.name = item.name
            data.location = item.location;
            data.value = 0;
            data.save(function(){
                console.log('added successfully')
            })
        }
    })
    Product.findOne({ productNo: item.productNo }, function (err, product) {
        if (product) {
            var received = product.quantityReceived;
            var issued = product.quantityIssued;
            var query = {
                _id: product.id
            }
            var data = {};
            data.quantityIssued = issued + item.quantity
            data.balance = product.balance - item.quantity;
            Product.update(query, data, function (err) {
                console.log('Updated successfully')
            })
            Sale.findOne({ orderNo: order.orderNo }, function (err, sale) {
                if (sale) {
                    var total = sale.totalProducts + item.quantity
                    var query = {
                        _id: sale.id
                    }
                    var data = {};

                    data.totalProducts = total;
                    Sale.update(query, data, function (err) {
                        console.log('Done')
                    })

                    Agent.findById(order.agentID, function (err, agent) {
                        var query1 =
                        {
                            _id: agent.id
                        }
                        var data1 = {};
                        data1.soldItems = total;
                        Agent.update(query1, data1, function (err) {
                            console.log('Agent updated successfully')
                        })
                    })
                    Customer.findOne({ customerNo: order.customerNo }, function (err, customer) {
                        var query2 = {
                            _id: customer.id
                        }
                        var data2 = {};

                        data2.products = total;
                        Customer.update(query2, data2, function (err) {
                            console.log('Customer updated successfully')
                        })
                    })
                }
            })


        }
    })
})