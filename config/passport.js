const passport = require('passport');
var Strategy   = require('passport-discord').Strategy;

const { Client } = require('pg')


    const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'password',
    database: 'bc'
    })
    client.connect()
    passport.serializeUser(function(user, done) {
  
        
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {

        done(null, user);
   
    });
    
    var scopes = ['identify', 'email'];
    


    passport.use(new Strategy({
        clientID: '531729010137235456',
        clientSecret: 'ZlsXcZtGnhgmUwiKFEfqr-Q33IyDC57O',
        callbackURL: 'http://157.230.0.249/auth/discord/callback',
        
        // clientID: '532170882114912256',
        // clientSecret: 'mX7OMrXxJZ95gi3FApjFArC2uGriuKWz',
        // callbackURL: 'http://localhost:8000/auth/discord/callback',

        scope: scopes
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {

            var user = null
            client.query('SELECT * FROM accounts WHERE discord_id=$1',  [profile.id], (err, res) => {

               // console.log(err ? err.stack : res.rows[0].message) // Hello World!
               if(res && res.rows[0]) {
                user = res.rows[0];
                
                if (user !=null) { 
                   
                    return done(null, user);
               }
            }else {
            
                client.query('INSERT INTO accounts(username, discord_id, email, token) VALUES($1, $2, $3, $4) RETURNING id',  [profile.username, profile.id,  profile.email, profile.accessToken], (err, res) => {
             //       client.end()
                    
                    if (err) {
                        console.log(err)
                      } else {
                        var id = res.rows[0].id
                        var newUser = {};
                        newUser.id = id
                        newUser.username = profile.username
                        newUser.token = profile.accessToken
                        newUser.email = profile.email
                        newUser.dicord_id = profile.id
    
                        return done(null, newUser);
                        // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
                      }
                    
                    
                 
                })
           

                // const res1 = await client.query('SELECT * FROM accounts WHERE id=$1',  [id])
                // newUser = res1.rows[0];
             

               
            }

               
         

              })
              
            


         


            // pg.connect(conString, function(err, client, done) {
            //     if (err != null) { console.log(err); }
            //     var user = null
            //     var query = client.query({
            //         text: "SELECT * FROM accounts WHERE discord_id=$1",
            //         values: [profile.id]
            //     }, function(err) { if (err != null) { console.log(err); } });
            //     query.on("row", function(row, result) { user = row; });
            //     query.on("end", function(result) {
            //         var usernameExists = false;
            //         if (user !=null) {
            //             console.log(user);
                        
            //            return done(null, user);
            //              //usernameExists = true; 

            //         }
            //         else {
                    
                    
            //             client.query({
            //                 text: "INSERT INTO accounts(username, discord_id, email, token" +
            //                     ") VALUES($1, $2, $3, $4) RETURNING id",
            //                     values: [profile.username, profile.id,  profile.email, profile.accessToken]
            //             }, function(err, result) {
            //                 if (err != null) { console.log(err);
            //                  }
            //                 else {
                                
                    
            //                     var id = result.rows[0].id
                                
            //                     var newUser = null;
            //                     var query = client.query({
            //                         text: "SELECT * FROM accounts WHERE id=$1",
            //                         values: [id]
            //                     }, function(err) { if (err != null) { console.log(err); } });
            //                     query.on("row", function(row, result) { 
            
            //                         newUser = row;
            //                      });
            //                     query.on("end", function(result) {

            //                           console.log('11');
                                        
                                    
            //                         return done(null, newUser); 
            //                     })
            //                 }
            //             });

            

                        
            //         }
                
                    
            //     });
            // });

            // return done(null, profile);
        });
    }));



