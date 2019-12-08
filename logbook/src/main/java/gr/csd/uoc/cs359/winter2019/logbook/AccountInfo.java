/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.csd.uoc.cs359.winter2019.logbook;

import gr.csd.uoc.cs359.winter2019.logbook.db.UserDB;
import gr.csd.uoc.cs359.winter2019.logbook.model.User;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.RequestDispatcher;

/**
 *
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

        HttpSession oldSession = request.getSession(false);
        if (oldSession != null && oldSession.getAttribute("username") != null) {
            response.setContentType("text/html;charset=UTF-8");
            User user = UserDB.getUser((String) oldSession.getAttribute("username"));
            request.setAttribute("username", oldSession.getAttribute("username"));
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
            request.setAttribute("gender", user.getGender());
            request.setAttribute("interests", user.getInterests());
            request.setAttribute("about", user.getInfo());
            request.setAttribute("title", "");
            request.setAttribute("button", "Update");
            RequestDispatcher dispatcher = request.getRequestDispatcher("WEB-INF/signup.jsp");
            dispatcher.forward(request, response);
        }
        else {
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
            request.setAttribute("interests", "");
            request.setAttribute("about", "");
            request.setAttribute("title", "Sign up");
            request.setAttribute("button", "Sign up");
            RequestDispatcher dispatcher = request.getRequestDispatcher("WEB-INF/signup.jsp");
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