/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.csd.uoc.cs359.winter2020.photobook;

import gr.csd.uoc.cs359.winter2020.photobook.db.UserDB;
import gr.csd.uoc.cs359.winter2020.photobook.model.OnlineUsers;
import org.json.simple.JSONObject;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.annotation.MultipartConfig;

/**
 * Do a signin.
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

        /* Redirect to the Init servlet if there is already a session */
        HttpSession oldSession = request.getSession(false);
        if (oldSession != null && oldSession.getAttribute("username") != null) {
            dispatcher = request.getRequestDispatcher("Init");
            dispatcher.forward(request, response);
        }

        /* check username */
        JSONObject jsonSignin = new JSONObject();
        request.setAttribute("parameter", "username");
        request.setAttribute("parameterValue", request.getParameter("username"));
        dispatcher = request.getRequestDispatcher("CheckOnDB");
        dispatcher.include(request, response);

        /* if attribute username does not exist, that means there was a problem querying the DB */
        if (request.getParameter("username") != null && request.getAttribute("username") == null) {
            jsonSignin.put("ERROR", "SERVER_ERROR");
            response.setContentType("application/json;charset=UTF-8");
            PrintWriter out = response.getWriter();
            out.print(jsonSignin.toJSONString());
            response.setStatus(500);
            return;
        }

        /* if username does not exist on DB, there is no need to check the password */
        if (request.getParameter("username") != null && request.getAttribute("username").equals("0")) {
            jsonSignin.put("username", "1");
            String password = request.getParameter("password").replace("'", "''");
            String username = request.getParameter("username");
            Boolean valid = UserDB.checkValidPassword(username, password);
            if (valid == null) {
                jsonSignin.put("ERROR", "SERVER_ERROR");
                response.setContentType("application/json;charset=UTF-8");
                PrintWriter out = response.getWriter();
                out.print(jsonSignin.toJSONString());
                response.setStatus(500);
                return;
            }
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

        /* return if either username or password are not valid */
        if (jsonSignin.get("username").equals("0") || jsonSignin.get("password").equals("0")) {
            response.setContentType("application/json;charset=UTF-8");
            PrintWriter out = response.getWriter();
            out.print(jsonSignin.toJSONString());
        }

        /* If both username and password are ok, we start a new session and redirect to the Init servlet */
        else {
            HttpSession newSession = request.getSession(true);
            newSession.setAttribute("username", request.getParameter("username"));
            OnlineUsers.addUser(request.getParameter("username"));
            Cookie cookie = new Cookie("JSESSIONID", newSession.getId());
            cookie.setMaxAge(365 * 24 * 3600);
            newSession.setMaxInactiveInterval(600);
            response.addCookie(cookie);
            dispatcher = request.getRequestDispatcher("Init");
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