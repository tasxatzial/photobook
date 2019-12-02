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
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.annotation.MultipartConfig;

/**
 *
 */
@WebServlet(name = "Signin", urlPatterns = {"/Signin"})
@MultipartConfig
public class Signin extends HttpServlet {

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

        RequestDispatcher dispatcher = null;

        JSONObject jsonSignin = new JSONObject();
        request.setAttribute("CheckUsernameDB", "1");
        dispatcher = request.getRequestDispatcher("CheckUsernameDB");
        dispatcher.include(request, response);
        if (request.getAttribute("username").equals("0")) {
            jsonSignin.put("username", "1");
            String password = request.getParameter("password");
            String username = request.getParameter("username");
            if (!UserDB.checkValidPassword(username, password)) {
                jsonSignin.put("password", "0");
            }
            else {
                jsonSignin.put("password", "1");
            }
        }
        else {
            jsonSignin.put("username", "0");
        }
        if (jsonSignin.get("username").equals("0") || jsonSignin.get("password").equals("0")) {
            response.setContentType("application/json;charset=UTF-8");
            PrintWriter out = response.getWriter();
            out.print(jsonSignin.toJSONString());
        }
        else {
            response.setContentType("text/html;charset=UTF-8");
            HttpSession newSession = request.getSession(true);
            newSession.setAttribute("username", request.getParameter("username"));
            newSession.setMaxInactiveInterval(24 * 3600 * 365);
            dispatcher = request.getRequestDispatcher("WEB-INF/homepage");
            dispatcher.forward(request, response);
        }
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