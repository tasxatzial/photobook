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
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.annotation.WebServlet;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpSession;

/**
 * Deletes an account. This also includes deleting all the posts by that account.
 * This action deletes the account and posts of the logged in user.
 */
@WebServlet(name = "DeleteAccount", urlPatterns = "/DeleteAccount")
@MultipartConfig
public class DeleteAccount extends HttpServlet {

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
        PrintWriter out = response.getWriter();
        JSONObject jsonFinal = new JSONObject();

        /* we need a valid session */
        HttpSession oldSession = request.getSession(false);
        if (oldSession == null || oldSession.getAttribute("username") == null) {
            jsonFinal.put("ERROR", "NO_SESSION");
            out.print(jsonFinal.toJSONString());
            response.setStatus(401);
            return;
        }

        /* delete the posts of the user */
        String username = (String) oldSession.getAttribute("username");
        request.setAttribute("username",username);
        RequestDispatcher dispatcher = request.getRequestDispatcher("DeletePost");
        dispatcher.include(request, response);

        if (request.getAttribute("DELETE_POSTS").equals("1")) {

            /* it is an error if the account does not exist */
            User user = UserDB.getUser(username);
            if (user == null) {
                jsonFinal.put("ERROR", "DELETE_ACCOUNT");
                out.print(jsonFinal.toJSONString());
                response.setStatus(500);
                return;
            }

            /* it is an error if the account cannot be deleted */
            UserDB.deleteUser(username);
            user = UserDB.getUser(username);
            if (user != null) {
                jsonFinal.put("ERROR", "DELETE_ACCOUNT");
                out.print(jsonFinal.toJSONString());
                response.setStatus(500);
            }
            else {
                oldSession.invalidate();
                out.print(jsonFinal.toJSONString());
            }
        }

        /* it is an error if all post could not be deleted. Do not delete the account in that case */
        else {
            jsonFinal.put("ERROR", "DELETE_POSTS");
            out.print(jsonFinal.toJSONString());
            response.setStatus(500);
        }
    }

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