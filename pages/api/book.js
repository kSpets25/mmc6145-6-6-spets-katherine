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

    // Require login
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Please log in first." });
    }

    try {
      if (method === "POST") {
        // Add a book for this user
       
        const { bookId} = req.body;
        if (!bookId) {
          return res.status(400).json({ error: "oh no" });
        }
        
        const addedBook = await db.book.add(user.id, bookId);
        
        return res.status(200).json({ message: "Book added successfully", book: addedBook });
      }
      
      if (method === "DELETE") {
        // Remove a book for this user
        const { bookId } = req.body;
        if (!bookId) {
          return res.status(400).json({ error: "oh no" });
          
        }
        const removedBook = await db.book.remove(user.id, bookId);
        return res
          .status(200)
          .json({ message: "Book removed successfully", book: removedBook });
      }

    } catch (err) {
      console.error("Error in /api/book:", err);
      return res
        .status(500)
        .json({ error: "Internal server error", details: err.message });
    }
    return res.status(404).end()
  },
  sessionOptions
);
