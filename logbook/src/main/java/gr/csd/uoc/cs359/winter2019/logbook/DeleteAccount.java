/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.csd.uoc.cs359.winter2019.logbook;

import gr.csd.uoc.cs359.winter2019.logbook.db.RatingDB;
import gr.csd.uoc.cs359.winter2019.logbook.db.UserDB;
import gr.csd.uoc.cs359.winter2019.logbook.model.OnlineUsers;
import gr.csd.uoc.cs359.winter2019.logbook.model.Rating;
import gr.csd.uoc.cs359.winter2019.logbook.model.User;
import org.json.simple.JSONObject;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.annotation.WebServlet;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpSession;

/**
 * Deletes an account. This also includes deleting all the posts by that account.
 * This action deletes the account and posts of the logged in user.
 */
@WebServlet(name = "DeleteAccount", urlPatterns = "/DeleteAccount")
@MultipartConfig
public class DeleteAccount extends HttpServlet {

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
        JSONObject jsonFinal = new JSONObject();

        /* we need a valid session */
        HttpSession oldSession = request.getSession(false);
        if (oldSession == null || oldSession.getAttribute("username") == null) {
            jsonFinal.put("ERROR", "NO_SESSION");
            out.print(jsonFinal.toJSONString());
            response.setStatus(401);
            return;
        }

        String username = (String) oldSession.getAttribute("username");

        /* now delete the ratings of the user */
        List<Integer> ratingsIDs = RatingDB.getRatings(username);
        for (Integer ratingsID : ratingsIDs) {
            RatingDB.deleteRating(ratingsID);

            /* verify that the rating has been deleted */
            Rating rating = RatingDB.getRate(ratingsID);
            if (rating == null) {
                jsonFinal.put("ERROR", "SERVER_ERROR");
                out.print(jsonFinal.toJSONString());
                response.setStatus(500);
                return;
            }
            if (rating.getRate() != -1) {
                jsonFinal.put("ERROR", "DELETE_OWN_RATINGS");
                out.print(jsonFinal.toJSONString());
                response.setStatus(500);
                return;
            }
        }

        /* delete the posts of the user */
        request.setAttribute("username", username);
        RequestDispatcher dispatcher = request.getRequestDispatcher("DeletePost");
        dispatcher.include(request, response);

        /* if the posts have been deleted proceed deleting the account */
        if (request.getAttribute("DELETE_POSTS") != null &&
                request.getAttribute("DELETE_POSTS").equals("1")) {

            /* verify that the account has been deleted */
            UserDB.deleteUser(username);
            User user = UserDB.getUser(username);
            if (user == null) {
                jsonFinal.put("ERROR", "SERVER_ERROR");
                out.print(jsonFinal.toJSONString());
                response.setStatus(500);
            }
            else if (user.getUserID() != 0) {
                jsonFinal.put("ERROR", "DELETE_ACCOUNT");
                out.print(jsonFinal.toJSONString());
                response.setStatus(500);
            }
            else {
                oldSession.invalidate();
                out.print(jsonFinal.toJSONString());
            }
            return;
        }

        /* it is an error if at least one post could not been deleted */
        else if (request.getAttribute("DELETE_POST_RATINGS").equals("0")){
            jsonFinal.put("ERROR", "DELETE_POST_RATINGS");
            out.print(jsonFinal.toJSONString());
            response.setStatus(500);
            return;
        }
        else if (request.getAttribute("DELETE_POSTS").equals("0")){
            jsonFinal.put("ERROR", "DELETE_POSTS");
            out.print(jsonFinal.toJSONString());
            response.setStatus(500);
            return;
        }
        OnlineUsers.removeUser(username);
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