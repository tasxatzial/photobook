/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.csd.uoc.cs359.winter2019.logbook;

import gr.csd.uoc.cs359.winter2019.logbook.db.UserDB;
import gr.csd.uoc.cs359.winter2019.logbook.model.Countries;
import gr.csd.uoc.cs359.winter2019.logbook.model.OnlineUsers;
import gr.csd.uoc.cs359.winter2019.logbook.model.User;
import org.json.simple.JSONObject;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.annotation.WebServlet;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpSession;


/**
 * Get the profile details of a user.
 */
@WebServlet(name = "GetProfile", urlPatterns = "/GetProfile")
@MultipartConfig
public class GetProfile extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ClassNotFoundException {
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();
        JSONObject json = new JSONObject();

        /* we need a valid session */
        HttpSession oldSession = request.getSession(false);
        if (oldSession == null || oldSession.getAttribute("username") == null) {
            json.put("ERROR", "NO_SESSION");
            out.print(json.toJSONString());
            response.setStatus(401);
            return;
        }

        String username = (String) oldSession.getAttribute("username");
        OnlineUsers.addUser(username);

        User user;
        if (request.getParameter("username") == null) {
            json.put("ERROR", "MISSING_PARAMETER");
            out.print(json.toJSONString());
            response.setStatus(400);
            return;
        }

        user = UserDB.getUser(request.getParameter("username"));
        /* check that the db returns a user */
        if (user == null) {
            json.put("ERROR", "SERVER_ERROR");
            out.print(json.toJSONString());
            response.setStatus(500);
            return;
        }

        /* check that the username exists */
        if (user.getUserID() == 0) {
            json.put("ERROR", "INVALID_USER");
            out.print(json.toJSONString());
            response.setStatus(400);
            return;
        }

        /* collect all required info */
        json.put("username", user.getUserName());
        json.put("email", user.getEmail());
        json.put("firstName", user.getFirstName());
        json.put("lastName", user.getLastName());
        json.put("birthDate", user.getBirthDate().split(" ")[0]);
        String country = Countries.getNameOf(user.getCountry());
        if (country != null) {
            json.put("country", country);
        }
        else {
            json.put("country", user.getCountry());
        }
        json.put("city", user.getTown());
        json.put("address", user.getAddress());
        json.put("job", user.getOccupation());
        json.put("gender", user.getGender().toString());
        json.put("interests", user.getInterests());
        json.put("about", user.getInfo());
        out.print(json.toJSONString());
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