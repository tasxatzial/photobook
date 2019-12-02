/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.csd.uoc.cs359.winter2019.logbook;

import gr.csd.uoc.cs359.winter2019.logbook.db.UserDB;
import gr.csd.uoc.cs359.winter2019.logbook.model.Countries;
import gr.csd.uoc.cs359.winter2019.logbook.model.User;
import org.json.simple.JSONObject;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Enumeration;
import java.util.Iterator;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.annotation.WebServlet;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpSession;

/**
 *
 */
@WebServlet(name = "Signup", urlPatterns = {"/Signup"})
@MultipartConfig
public class Signup extends HttpServlet {

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

        JSONObject jsonSignup = new JSONObject();
        RequestDispatcher dispatcher;

        String passwd1 = request.getParameter("password");
        Enumeration paramNames = request.getParameterNames();

        while (paramNames.hasMoreElements()) {
            String paramName = (String) paramNames.nextElement();
            String[] paramValues = request.getParameterValues(paramName);
            switch (paramName) {
                case "firstName":
                case "lastName":
                case "username":
                case "password":
                case "email":
                case "job":
                case "city":
                    if (!paramValues[0].matches(getRegexPattern(paramName))) {
                        jsonSignup.put(paramName, "Invalid pattern");
                    }
                    else {
                        jsonSignup.put(paramName, "");
                    }
                    break;
                case "password-confirm":
                    if (passwd1.matches(getRegexPattern("password")) &&
                            !passwd1.equals(paramValues[0])) {
                        jsonSignup.put(paramName, "Passwords don't match");
                    }
                    else {
                        jsonSignup.put(paramName, "");
                    }
                    break;
                case "birthDate":
                    if (!isValidDate(paramValues[0])) {
                        jsonSignup.put(paramName, "Invalid pattern");
                    }
                    else {
                        jsonSignup.put(paramName, "");
                    }
                    break;
                case "country":
                    if (Countries.getNameOf(paramValues[0]) == null) {
                        jsonSignup.put(paramName, "Invalid value");
                    }
                    else {
                        jsonSignup.put(paramName, "");
                    }
                    break;
                case "interests":
                    if (paramValues[0].length() > 100) {
                        jsonSignup.put(paramName, "Exceeds maximum size (100)");
                    }
                    else {
                        jsonSignup.put(paramName, "");
                    }
                    break;
                case "about":
                    if (paramValues[0].length() > 500) {
                        jsonSignup.put(paramName, "Exceeds maximum size (500)");
                    }
                    else {
                        jsonSignup.put(paramName, "");
                    }
                    break;
                default:
                    break;
            }
        }

    }

    protected boolean isValidDate(String date) {
        DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        sdf.setLenient(false);
        try {
            sdf.parse(date);
        } catch (ParseException e) {
            return false;
        }
        return true;
    }

    protected String getRegexPattern(String field) {
        switch(field) {
            case "username":
                return "^[A-Za-z]{8,}$";
            case "password":
                return "^[\\w0-9!#$%&'*+/=?^`{|}\\[\\]_\\\\~<>., -]{8,10}$";
            case "email":
                return "^[\\w!#$%&'*+/=?^`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$";
            case "firstName":
            case "job":
            case "lastName":
                return "^[^0-9!#$%&'*+/=?^`{|}\\[\\]_\\\\~<>.,-]{3,15}$";
            case "city":
                return "^[^!#$%&'*+/=?^`{|}\\[\\]_\\\\~<>.,]{2,20}$";
            default:
                return null;
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