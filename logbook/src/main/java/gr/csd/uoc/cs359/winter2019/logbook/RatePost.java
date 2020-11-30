/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.csd.uoc.cs359.winter2019.logbook;

import gr.csd.uoc.cs359.winter2019.logbook.db.PostDB;
import gr.csd.uoc.cs359.winter2019.logbook.db.RatingDB;
import gr.csd.uoc.cs359.winter2019.logbook.model.OnlineUsers;
import gr.csd.uoc.cs359.winter2019.logbook.model.Post;
import gr.csd.uoc.cs359.winter2019.logbook.model.Rating;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

/**
 * Rates a post.
 */
@WebServlet(name = "RatePost", urlPatterns = "/RatePost")
@MultipartConfig
public class RatePost extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, ClassNotFoundException {
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();
        JSONObject json = new JSONObject();

        /* only a logged in user can rate a post */
        HttpSession oldSession = request.getSession(false);
        if (oldSession == null || oldSession.getAttribute("username") == null) {
            json.put("ERROR", "NO_SESSION");
            out.print(json.toJSONString());
            response.setStatus(401);
            return;
        }

        String username = (String) oldSession.getAttribute("username");
        OnlineUsers.addUser(username);

        /* we need an post ID so that we know which post to rate */
        String postID = request.getParameter("postID");
        if (postID == null) {
            json.put("ERROR", "MISSING_POSTID");
            response.setStatus(400);
            out.print(json.toJSONString());
            return;
        }

        /* we need to check that the postID is valid number and that it exists */
        int pID;
        try {
            pID = Integer.parseInt(postID);
        }
        catch (NumberFormatException e) {
            json.put("ERROR", "INVALID_POSTID");
            response.setStatus(400);
            out.print(json.toJSONString());
            return;
        }

        Post post = PostDB.getPost(pID);
        if (post == null) {
            json.put("ERROR", "INVALID_POST");
            out.print(json.toJSONString());
            response.setStatus(400);
            return;
        }

        /* we need the requested postID to belong to a different user than the one currently logged in */
        String postUsername = post.getUserName();
        if (postUsername.equals(username)) {
            json.put("ERROR", "UNAUTHORIZED");
            response.setStatus(401);
            out.print(json.toJSONString());
            return;
        }

        /* finally we need a rate */
        String rate = request.getParameter("rate");
        if (rate == null) {
            json.put("ERROR", "MISSING_RATE");
            response.setStatus(400);
            out.print(json.toJSONString());
            return;
        }

        /* if rate is an empty string, the user will delete the rating if it exists */
        if (rate.equals("")) {
            Rating rating = RatingDB.getRating(pID, username);
            if (rating == null) {
                json.put("ERROR", "SERVER_ERROR");
                out.print(json.toJSONString());
                response.setStatus(500);
                return;
            }
            if (rating.getRate() > 0) {
                int id = rating.getID();
                RatingDB.deleteRating(id);

                rating = RatingDB.getRating(pID, username);
                if (rating == null) {
                    json.put("ERROR", "SERVER_ERROR");
                    out.print(json.toJSONString());
                    response.setStatus(500);
                    return;
                }

                /* return the updated ratings */
                List<Rating> ratingsList = RatingDB.getRatings(pID);
                if (ratingsList == null) {
                    json.put("ERROR", "SERVER_ERROR");
                    out.print(json.toJSONString());
                    response.setStatus(500);
                    return;
                }
                JSONArray ratings = new JSONArray();
                for (Rating r : ratingsList) {
                    ratings.add(r.getRate());
                }
                json.put("ratings", ratings);
                out.print(json.toJSONString());
            }
        }
        else {
            /* we need to check that the rating is a number from 1 to 5 */
            int ratingNum;
            try {
                ratingNum = Integer.parseInt(rate);
            }
            catch (NumberFormatException e) {
                json.put("ERROR", "INVALID_RATING");
                response.setStatus(400);
                out.print(json.toJSONString());
                return;
            }

            if (ratingNum != 1 && ratingNum != 2 && ratingNum != 3 && ratingNum !=4 && ratingNum !=5) {
                json.put("ERROR", "INVALID_RATING");
                response.setStatus(400);
                out.print(json.toJSONString());
                return;
            }

            /* all is ok, create the rating */
            Rating rating = new Rating();
            rating.setUserName(username);
            rating.setRate(ratingNum);
            rating.setPostID(pID);

            /* check whether there is already a rating in the db and either update or add a new one */
            Rating oldRating = RatingDB.getRating(pID, username);
            if (oldRating == null) {
                json.put("ERROR", "SERVER_ERROR");
                out.print(json.toJSONString());
                response.setStatus(500);
                return;
            }
            if (oldRating.getRate() > 0) {
                oldRating.setRate(ratingNum);
                RatingDB.updateRating(oldRating);
            }
            else {
                RatingDB.addRating(rating);
            }

            /* verify that rating has been written on the db */
            int rateDB = RatingDB.getRate(pID, username);
            if (rateDB == -1) {
                json.put("ERROR", "SERVER_ERROR");
                out.print(json.toJSONString());
                response.setStatus(500);
                return;
            }

            /* return the updated ratings */
            List<Rating> ratingsList = RatingDB.getRatings(pID);
            if (ratingsList == null) {
                json.put("ERROR", "SERVER_ERROR");
                out.print(json.toJSONString());
                response.setStatus(500);
                return;
            }

            JSONArray ratings = new JSONArray();
            for (Rating r : ratingsList) {
                ratings.add(r.getRate());
            }
            json.put("ratings", ratings);
            out.print(json.toJSONString());
        }
    }

    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}