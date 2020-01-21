/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.csd.uoc.cs359.winter2019.logbook;

import org.json.simple.JSONObject;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.annotation.WebServlet;
import javax.servlet.annotation.MultipartConfig;

/**
 *
 */
@WebServlet(name = "CheckUsernameEmailDB", urlPatterns = {"/CheckUsernameEmailDB"})
@MultipartConfig
public class CheckUsernameEmailDB extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException {

        response.setContentType("application/json;charset=UTF-8");
        JSONObject json = new JSONObject();
        RequestDispatcher dispatcher;

        if (request.getParameter("email") != null) {
            request.setAttribute("parameter", "email");
            request.setAttribute("parameterValue", request.getParameter("email"));
            dispatcher = request.getRequestDispatcher("CheckOnDB");
            dispatcher.include(request, response);
            if (request.getAttribute("email").equals("0")) {
                json.put("email", "Already taken");
            }
        }
        if (request.getParameter("username") != null) {
            request.setAttribute("parameter", "username");
            request.setAttribute("parameterValue", request.getParameter("username"));
            dispatcher = request.getRequestDispatcher("CheckOnDB");
            dispatcher.include(request, response);
            if (request.getAttribute("username").equals("0")) {
                json.put("username", "Already taken");
            }
        }
        
        PrintWriter out = response.getWriter();
        out.print(json.toJSONString());
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
        } catch (ServletException e) {
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
        } catch (ServletException e) {
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