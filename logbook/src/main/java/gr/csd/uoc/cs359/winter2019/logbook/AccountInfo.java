/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.csd.uoc.cs359.winter2019.logbook;

import gr.csd.uoc.cs359.winter2019.logbook.db.UserDB;
import gr.csd.uoc.cs359.winter2019.logbook.model.User;
import org.json.simple.JSONObject;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.RequestDispatcher;

/**
 * Returns the signup form filled in with the account info of the logged in user (if an edit account info was requested)
 * or an empty signup form (if the user wants to signup).
 */
@WebServlet(name = "AccountInfo", urlPatterns = "/AccountInfo")
@MultipartConfig
public class AccountInfo extends HttpServlet {

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
        PrintWriter out = response.getWriter();
        JSONObject json = new JSONObject();

        /* if we are requesting to edit the account info then fill in the signup form before returning the the form */
        if (request.getParameter("action") != null && request.getParameter("action").equals("AccountInfo")) {
            HttpSession oldSession = request.getSession(false);

            /* we need a valid session */
            if (oldSession != null && oldSession.getAttribute("username") != null) {
                String username = (String) oldSession.getAttribute("username");
                User user = UserDB.getUser(username);

                /* get the account info only for the logged in user */
                if (user == null) {
                    response.setContentType("application/json;charset=UTF-8");
                    json.put("ERROR", "INVALID_USER");
                    out.print(json.toJSONString());
                    response.setStatus(400);
                }
                else {
                    response.setContentType("text/html;charset=UTF-8");
                    request.setAttribute("username", username);
                    request.setAttribute("password", user.getPassword());
                    request.setAttribute("passwordConfirm", user.getPassword());
                    request.setAttribute("email", user.getEmail());
                    request.setAttribute("firstName", user.getFirstName());
                    request.setAttribute("lastName", user.getLastName());
                    request.setAttribute("birthDate", user.getBirthDate().split(" ")[0]);
                    request.setAttribute("country", user.getCountry());
                    request.setAttribute("city", user.getTown());
                    request.setAttribute("address", user.getAddress());
                    request.setAttribute("job", user.getOccupation());
                    request.setAttribute("gender", user.getGender().toString());
                    setGender(request);
                    request.setAttribute("interests", user.getInterests());
                    request.setAttribute("about", user.getInfo());
                    request.setAttribute("title", "My account");
                    request.setAttribute("button", "Update");
                    RequestDispatcher dispatcher = request.getRequestDispatcher("WEB-INF/signup.jsp");
                    dispatcher.forward(request, response);
                }
            }
            else {
                response.setContentType("application/json;charset=UTF-8");
                json.put("ERROR", "NO_SESSION");
                out.print(json.toJSONString());
                response.setStatus(401);
            }
        }

        /* If we are requesting a signup, just return an empty signup form */
        else if (request.getParameter("action") != null && request.getParameter("action").equals("GetSignup")) {
            response.setContentType("text/html;charset=UTF-8");
            request.setAttribute("username", "");
            request.setAttribute("password", "");
            request.setAttribute("passwordConfirm", "");
            request.setAttribute("email", "");
            request.setAttribute("firstName", "");
            request.setAttribute("lastName", "");
            request.setAttribute("birthDate", "");
            request.setAttribute("country", "");
            request.setAttribute("city", "");
            request.setAttribute("address", "");
            request.setAttribute("job", "");
            request.setAttribute("gender", "Unknown");
            setGender(request);
            request.setAttribute("interests", "");
            request.setAttribute("about", "");
            request.setAttribute("title", "Sign up");
            request.setAttribute("button", "Sign up");
            RequestDispatcher dispatcher = request.getRequestDispatcher("WEB-INF/signup.jsp");
            dispatcher.forward(request, response);
        }
        else {
            response.setContentType("application/json;charset=UTF-8");
            json.put("ERROR", "INVALID_ACTION");
            out.print(json.toJSONString());
            response.setStatus(400);
        }
    }

    /**
     * Sets the proper gender in the signup form.
     * @param request
     */
    void setGender(HttpServletRequest request) {
        request.setAttribute("male-checked", "");
        request.setAttribute("female-checked", "");
        request.setAttribute("unknown-checked", "");
        if (request.getAttribute("gender").equals("Male")) {
            request.setAttribute("male-checked", "checked");
        }
        else if (request.getAttribute("gender").equals("Female")) {
            request.setAttribute("female-checked", "checked");
        }
        else {
            request.setAttribute("unknown-checked", "checked");
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