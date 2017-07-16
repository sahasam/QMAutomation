
/*
 * GET users listing.
 */

exports.list = function(req, res){

  req.getConnection(function(err,connection){

        var query = connection.query('SELECT * FROM QM_GEAR_1',function(err,rows)
        {

            if(err)
                console.log("Error Selecting : %s ",err );

            res.render('gear',{page_title:"QM Gear",data:rows});


         });

         //console.log(query.sql);
    });

};

exports.add = function(req, res){
  res.render('add_gear',{page_title:"Add Gear"});
};

exports.edit = function(req, res){

    var id = req.params.id;

    req.getConnection(function(err,connection){

        var query = connection.query('SELECT * FROM QM_GEAR_1 WHERE id = ?',[id],function(err,rows)
        {

            if(err)
                console.log("Error Selecting : %s ",err );

            res.render('edit_gear',{page_title:"Edit Gear",data:rows});


         });

         //console.log(query.sql);
    });
};

/*Save the customer*/
exports.save = function(req,res){

    var input = JSON.parse(JSON.stringify(req.body));

    req.getConnection(function (err, connection) {

        var data = {

            ID    : input.id,
            NOTES : input.notes,
            ITEM_CONDITION   : input.itme_condition,
            ITEM_STATUS   : input.item_status,
            LAST_USER     : input.last_user

        };

        var query = connection.query("INSERT INTO QM_GEAR_1 set ? ",data, function(err, rows)
        {

          if (err)
              console.log("Error inserting : %s ",err );

          res.redirect('inventory');

        });

       // console.log(query.sql); get raw query

    });
};

exports.save_edit = function(req,res){

    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;

    req.getConnection(function (err, connection) {

        var data = {

            ID    : input.id,
            NOTES : input.notes,
            ITEM_CONDITION   : input.item_condition,
            ITEM_STATUS   : input.item_status,
            LAST_USER     : input.last_user

        };

        connection.query("UPDATE QM_GEAR_1 set ? WHERE id = ? ",[data,id], function(err, rows)
        {

          if (err)
              console.log("Error Updating : %s ",err );

          res.redirect('inventory');

        });

    });
};


exports.delete_gear = function(req,res){

     var id = req.params.id;

     req.getConnection(function (err, connection) {

        connection.query("DELETE FROM QM_GEAR_1  WHERE id = ? ",[id], function(err, rows)
        {

             if(err)
                 console.log("Error deleting : %s ",err );

             res.redirect('inventory');

        });

     });
};
