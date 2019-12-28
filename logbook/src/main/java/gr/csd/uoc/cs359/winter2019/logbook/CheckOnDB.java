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
@WebServlet(name = "CheckOnDB", urlPatterns = {"/CheckOnDB"})
@MultipartConfig
public class CheckOnDB extends HttpServlet {

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

        String parameter = null;
        String parameterValue = null;

        if (request.getAttribute("parameter") != null) {
            parameter = (String) request.getAttribute("parameter");
            parameterValue = (String) request.getAttribute("parameterValue");
            if (parameterValue == null) {
                request.setAttribute(parameter, "0");
            } else {
                check(request, parameterValue, parameter);
            }
        } else {
            parameter = request.getParameter("parameter");
            parameterValue = request.getParameter("parameterValue");
            JSONObject json = new JSONObject();
            if (parameterValue == null) {
                json.put(parameter, "0");
            } else {
                checkJSON(request, parameterValue, parameter, json);
            }
            out.print(json.toJSONString());
        }
    }

    protected void checkJSON(HttpServletRequest request, String parameterValue, String parameter, JSONObject json) throws ClassNotFoundException {
        check(request, parameterValue, parameter);
        if (request.getAttribute(parameter).equals("0")) {
            json.put(parameter, "0");
        }
        else {
            json.put(parameter, "1");
        }
    }

    protected void check(HttpServletRequest request, String parameterValue, String parameter) throws ClassNotFoundException {
        boolean valid = false;
        if (parameter.equals("email")) {
            valid = UserDB.checkValidEmail(parameterValue);
        }
        else if (parameter.equals("username")){
            valid = UserDB.checkValidUserName(parameterValue);
        }
        if (!valid) {
            request.setAttribute(parameter, "0");
        }
        else {
            request.setAttribute(parameter, "1");
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