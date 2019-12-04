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
@WebServlet(name = "CheckEmailDB", urlPatterns = {"/CheckEmailDB"})
@MultipartConfig
public class CheckEmailDB extends HttpServlet {

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
        String email = request.getParameter("email");
        if (request.getAttribute("CheckEmailDB") != null) {
            if (email == null) {
                request.setAttribute("email", "0");
            } else {
                checkEmail(request, email);
            }
        } else {
            JSONObject json = new JSONObject();
            if (email == null) {
                json.put("email", "0");
            } else {
                checkEmailJSON(request, email, json);
            }
            PrintWriter out = response.getWriter();
            out.print(json.toJSONString());
        }
    }

    protected void checkEmailJSON(HttpServletRequest request, String email, JSONObject json) throws ClassNotFoundException {
        checkEmail(request, email);
        if (request.getAttribute("email").equals("0")) {
            json.put("email", "0");
        }
        else {
            json.put("email", "1");
        }
    }

    protected void checkEmail(HttpServletRequest request, String email) throws ClassNotFoundException {
        boolean validEmail = UserDB.checkValidEmail(email);
        if (!validEmail) {
            request.setAttribute("email", "0");
        }
        else {
            request.setAttribute("email", "1");
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