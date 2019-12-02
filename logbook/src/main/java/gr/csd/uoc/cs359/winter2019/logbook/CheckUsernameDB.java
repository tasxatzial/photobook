/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.csd.uoc.cs359.winter2019.logbook;

import gr.csd.uoc.cs359.winter2019.logbook.db.UserDB;
import org.json.simple.JSONObject;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.annotation.WebServlet;
import javax.servlet.annotation.MultipartConfig;

/**
 *
 */
@WebServlet(name = "CheckUsernameDB", urlPatterns = {"/CheckUsernameDB"})
@MultipartConfig
public class CheckUsernameDB extends HttpServlet {

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
        String username = request.getParameter("username");
        if (request.getAttribute("CheckUsernameDB") != null) {
            if (username == null) {
                request.setAttribute("username", "0");
            }
            else {
                checkUsername(request, username);
            }
        }
        else {
            JSONObject json = new JSONObject();
            if (username == null) {
                json.put("username", "0");
            } else {
                checkUsernameJSON(request, username, json);
            }
            PrintWriter out = response.getWriter();
            out.print(json.toJSONString());
        }
    }

    protected void checkUsernameJSON(HttpServletRequest request, String username, JSONObject json) throws ClassNotFoundException {
        checkUsername(request, username);
        if (request.getAttribute("username").equals("1")) {
            json.put("username", "1");
        }
        else if (request.getAttribute("username").equals("0")) {
            json.put("username", "0");
        }
        else {
            json.put("username", "-1");
        }
    }

    protected void checkUsername(HttpServletRequest request, String username) throws ClassNotFoundException {
        int validUsername = UserDB.checkValidUserName(username);
        if (validUsername == 0) {
            request.setAttribute("username", "0");
        }
        else if (validUsername == 1) {
            request.setAttribute("username", "1");
        }
        else {
            request.setAttribute("username", "-1");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
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
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
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