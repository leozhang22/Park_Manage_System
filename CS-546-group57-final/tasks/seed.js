const connection = require('../config/mongoConnection');
const data = require('../data/');
const userData = data.userData;
const reviewData = data.reviewData;
const managerData = data.managerData;
const eventData = data.eventData;


const main = async () => {
    const db = await connection.dbConnection();
    await db.dropDatabase();
 
    //Seed manager
    const M1 = await managerData.creatManager("Jessica0917","$2y$16$nEHCMDVuRC52/1j2AXfsyu5zsh3btEm0a3uvq.35kpEYR/pnFfS2a")
    
    //Seed Sample events
    const E1 = await eventData.addEvent("sports", "12th High School Basketball Game ", 50, "01/26/2023");
    const E2 = await eventData.addEvent("sports", "13th High School Basketball Game ", 70, "02/02/2023");
    const E3 = await eventData.addEvent("sports", "14th High School Basketball Game ", 40, "01/20/2023");
    const E4 = await eventData.addEvent("sports", "17th High School Basketball Game ", 40, "02/05/2023");
    const E5 = await eventData.addEvent("sports", "18th High School Basketball Game ", 40, "05/04/2023");
    
    const E6 = await eventData.addEvent("art", "14th High School art show ", 40, "01/01/2023");
    const E7 = await eventData.addEvent("art", "16th High School art show ", 65, "01/05/2023");
    const E8 = await eventData.addEvent("art", "18th High School art show ", 80, "01/27/2023");
    const E9 = await eventData.addEvent("art", "20th High School art show ", 13, "01/28/2023");
    const E10 = await eventData.addEvent("art", "21th High School art show ", 60, "02/15/2023");
    
    const E11 = await eventData.addEvent("concert", "17th High School concern ", 40, "02/03/2023");
    const E12 = await eventData.addEvent("concert", "7th High School concern ", 39, "03/11/2023");
    const E13 = await eventData.addEvent("concert", "4th High School concern ", 41, "02/27/2023");
    const E14 = await eventData.addEvent("concert", "5th High School concern ", 27, "02/23/2023");
    const E15 = await eventData.addEvent("concert", "9th High School concern ", 39, "05/24/2023");

    const E16 = await eventData.addEvent("sports", "4th High School Basketball Game ", 40, "05/04/2023");
    const E17 = await eventData.addEvent("art", "7th High School art show ", 23, "01/01/2023");
    const E18 = await eventData.addEvent("concert", "1th High School concern ", 41, "02/03/2023");

    //seed user
    
    const U1 = await userData.createUser("Anna0977", "$2a$16$55b4ftaRCsHZcJ2X3VAmL.X85wi/K3ydOMWRoyafn2ubiA38l4HnK", "Brown", "anna",29);
    const U2 = await userData.createUser("Anshul0629", "$2y$16$44T/HRDYr7ZJr5NgxKZ0GO5VUWIO7eEzeh.SQauQqfsUhjLLm8XBq","Kapoor", "anshul",25);
    const U3 = await userData.createUser("Kamil7799","$2y$16$hJSJuDrg9GRus/zD3mfg..OhlFSEM1VFeOi4cxJhxKhHHmpPZRnjW","Zambrowski", "kamil",22);
    const U4 = await userData.createUser("Michael1013","$2y$16$yRArTdcisBcd6ED5FEWJuO/Z.LMWsUbHz52FotTzYtf86Kc4QKE6a", "Lyons", "michael",22);
    const U5 = await userData.createUser("John2977", "$2y$16$KIjnyLrJ02Kpp6Y6HLZ6C.BDZidhOY73JYc4utfKCJB48Ithhr1oK","Doe", "john", 22);
    const U6 = await userData.createUser("Ava7024", "$2y$16$ZvmyAhGKEXDIe1gDejC38.K7xWYnF2SzYhlr4GTuv6cNFmqbtH2k6", "Tartaglia", "ava",23);
    const U7 = await userData.createUser("Dan1920","$2y$16$dm4xV.Gvptu2Xl3Kh/S/suk8OoUoKZXUkqKExk8WD3ZUZXxd4QeK.", "Pelis", "dan",24);
    const U9 = await userData.createUser("Miles0346","$2y$16$IlU5ezmEuCip.KMmemBi7ePqMtT9JKkzZXhH05ILe7tqeKZemFn.m", "Rosenberg", "miles",28);
    const U10 = await userData.createUser("Joe2009","$2y$16$E0t0gNTnCXbW.nvDjnQSZ.yUN0cjdv4sHIWHciyu45N4BEdamdBzu", "Smith", "joe",26);
    
    //seed register

    const R1 = await eventData.addUserOfEvent ("12th High School Basketball Game ","Miles0346")
    const R2 = await eventData.addUserOfEvent ("14th High School art show ","Anshul0629")
    const R3 = await eventData.addUserOfEvent ("12th High School Basketball Game ","Anshul0629")
    const R4 = await eventData.addUserOfEvent ("9th High School concern ","John2977")
    const R5 = await eventData.addUserOfEvent ("14th High School art show ","Anna0977")
    const R6 = await eventData.addUserOfEvent ("4th High School Basketball Game ","Kamil7799")
    const R7 = await eventData.addUserOfEvent ( "14th High School Basketball Game ","Dan1920")
    const R8 = await eventData.addUserOfEvent ( "1th High School concern ","Michael1013")
    const R9 = await eventData.addUserOfEvent ("17th High School Basketball Game ","Joe2009")
    const R10 = await eventData.addUserOfEvent ("13th High School Basketball Game ","Dan1920")
    const R11 = await eventData.addUserOfEvent ("18th High School art show ","Anna0977")
    const R12 = await eventData.addUserOfEvent ("14th High School art show ","Michael1013")
    const R13 = await eventData.addUserOfEvent ("12th High School Basketball Game ","Anna0977")
    const R14 = await eventData.addUserOfEvent ("20th High School art show ","Joe2009")
    const R15 = await eventData.addUserOfEvent ("20th High School art show ","Anna0977")
    const R16 = await eventData.addUserOfEvent ("20th High School art show ","John2977")
    const R17 = await eventData.addUserOfEvent ("21th High School art show ","Anna0977")
  
    //seed get user by name
    const N9 = await userData.getUserByName("Miles0346")
    const N2 = await userData.getUserByName("Anshul0629")
    const N5 = await userData.getUserByName("John2977")
    const N1 = await userData.getUserByName("Anna0977")
    const N3 = await userData.getUserByName("Kamil7799")
    const N7 = await userData.getUserByName("Dan1920")
    const N4 = await userData.getUserByName("Michael1013")
    const N10 = await userData.getUserByName("Joe2009")
    //seed get event by name
    const T1 = await eventData.searchByEventName( "12th High School Basketball Game ")
    const T6 = await eventData.searchByEventName( "14th High School art show ")
    const T15 = await eventData.searchByEventName("9th High School concern ")
    const T16 = await eventData.searchByEventName( "4th High School Basketball Game ")
    const T3 = await eventData.searchByEventName("14th High School Basketball Game ")
    const T18 = await eventData.searchByEventName("1th High School concern ")
    const T2 = await eventData.searchByEventName( "13th High School Basketball Game ")
    const T4 = await eventData.searchByEventName("17th High School Basketball Game ")
    const T8 = await eventData.searchByEventName("18th High School art show ")
    //seed review
    const C1 = await reviewData.createReview (String(T1._id),String(N9._id), 'C1 I love it so much',5)
    const C2 = await reviewData.createReview (String(T6._id),String(N2._id), 'C2 I love it so much',2)
    const C3 = await reviewData.createReview (String(T1._id), String(N2._id), 'C3 I love it so much',3)
    const C4 = await reviewData.createReview (String(T15._id), String(N5._id), 'C4 I love it so much',1)
    const C5 = await reviewData.createReview (String(T6._id), String(N1._id), 'C5 I love it so much',2)

    const C7 = await reviewData.createReview (String(T3._id), String(N7._id), 'C7 I love it so much',3)
    const C8 = await reviewData.createReview (String(T18._id), String(N4._id), 'C8 I love it so much',2)
    const C9 = await reviewData.createReview (String(T4._id),String( N10._id), 'C9 I love it so much',5)
    const C10 = await reviewData.createReview (String(T2._id), String(N7._id), 'C10 I love it so much',3)
    const C11= await reviewData.createReview (String(T8._id), String(N1._id), 'C11 I love it so much',4)
    const C12 = await reviewData.createReview (String(T6._id), String(N4._id), 'C12 I love it so much',2)
    const C13= await reviewData.createReview (String(T1._id), String(N1._id), 'C13 I love it so much',1)
 
   
   

    console.log('Done seeding database for Collection!');
};

main().catch(error => {
    console.log(error);
});