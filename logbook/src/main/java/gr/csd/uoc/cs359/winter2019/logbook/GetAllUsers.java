/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.csd.uoc.cs359.winter2019.logbook;

import gr.csd.uoc.cs359.winter2019.logbook.db.UserDB;
import gr.csd.uoc.cs359.winter2019.logbook.model.OnlineUsers;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.annotation.WebServlet;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpSession;

/**
 * Get all usernames.
 */
@WebServlet(name = "GetAllUsers", urlPatterns = "/GetAllUsers")
@MultipartConfig
public class GetAllUsers extends HttpServlet {

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
        JSONObject json = new JSONObject();
        PrintWriter out = response.getWriter();

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

        JSONObject jsonPage = new JSONObject();
        List<List<String>> usernames = UserDB.getAllUsersNames();
        if (usernames == null) {
            json.put("ERROR", "SERVER_ERROR");
            out.print(json.toJSONString());
            response.setStatus(500);
            return;
        }

        int j = 1; //first page is 1
        for (int i = 0; i < usernames.size(); i++) {
            JSONObject jsonUser = new JSONObject();
            jsonUser.put("n", usernames.get(i).get(0));
            jsonUser.put("r", usernames.get(i).get(1).substring(0, 10));
            jsonPage.put(Integer.toString(i + 1), jsonUser);
            if (i % 10 == 9 || i == usernames.size() - 1) {
                json.put(Integer.toString(j), jsonPage);
                j++;
                jsonPage = new JSONObject();
            }
        }
        if (usernames.size() == 0) {
            json.put("0", jsonPage);
        }
        out.print(json.toJSONString());
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
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