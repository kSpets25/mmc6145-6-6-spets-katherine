import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'


// this handler runs for /api/book with any request method (GET, POST, etc)
export default withIronSessionApiRoute(
  async function handler(req, res) {
    // TODO: On a POST request, add a book using db.book.add with request body 
    // TODO: On a DELETE request, remove a book using db.book.remove with request body 
    // TODO: Respond with 404 for all other requests
    // User info can be accessed with req.session
    // No user info on the session means the user is not logged in
   
    const { method } = req;
    const user = req.session.user;
    console.log("Session user:", req.session.user);
    
    // Require login
      if (!user) {
        return res.status(401).json({ error: "Unrecognized: Please log in first." }); 
        
      }
     
      if ( method === "POST") {
        // Add a book for this user

        const book  = req.body;
        console.log('Received book:', book);

        const addedBook = await db.book.add(user.id, book);
        if (!addedBook) {
          // Destroy session if user/book not found
          req.session.destroy();
          
          return res.status(401).json({ error: "Unauthorized: User not found or cannot add book." });
           // (error) => {
          //  console.error("Book remove error:", error);
           // return res.status(400).json({ error: error.message || "oh no" });
          //}
        }
        
          return res.status(200).json({ message: "Book added successfully", book: addedBook });
         
      }
      
      if (method === "DELETE") {
        // Remove a book for this user
        const book = req.body;
        const bookId = book.id
        
        console.log('removed book', bookId)
        const removedBook = await db.book.remove(user.id, bookId);
        if (!removedBook) {
          // Destroy session if user/book not found
          req.session.destroy();
          return res.status(401).json({ error: "Unauthorized: User not found or cannot add book." });
        }
        return res.status(200).json({ message: "Book removed successfully", bookId: removedBook }); 
       
        }
      
      return res.status(404).end();
  },
  sessionOptions
  );
  