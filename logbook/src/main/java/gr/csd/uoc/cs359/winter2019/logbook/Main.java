/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.csd.uoc.cs359.winter2019.logbook;

import org.json.simple.JSONObject;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.RequestDispatcher;


/**
 * The Main servlet. All client requests are handled by this servlet.
 */
@WebServlet(name = "Main", urlPatterns = "/Main")
@MultipartConfig
public class Main extends HttpServlet {

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
            throws ServletException, IOException {
        HttpSession oldSession = null;
        JSONObject json = new JSONObject();

        /* we need a valid action parameter */
        if (request.getParameter("action") == null) {
            response.setContentType("application/json;charset=UTF-8");
            PrintWriter out = response.getWriter();
            json.put("MISSING_FIELDS", "action");
            out.print(json.toJSONString());
            response.setStatus(400);
            return;
        };

        RequestDispatcher dispatcher = null;
        switch(request.getParameter("action")) {
            case "Init":
                dispatcher = request.getRequestDispatcher("Init");
                break;
            case "GetSignin":
                dispatcher = request.getRequestDispatcher("WEB-INF/signin");
                break;
            case "GetSignup": //get the Signup form, the same form is used for updating account info
            case "AccountInfo":
                dispatcher = request.getRequestDispatcher("AccountInfo");
                break;
            case "CheckUsernameEmailDB":
                dispatcher = request.getRequestDispatcher("CheckUsernameEmailDB");
                break;
            case "Signup": //do a Signup or update the account info
            case "UpdateAccount":
                dispatcher = request.getRequestDispatcher("Signup");
                break;
            case "Signin":
                dispatcher = request.getRequestDispatcher("Signin");
                break;
            case "GetAllUsers":
                dispatcher = request.getRequestDispatcher("GetAllUsers");
                break;
            case "GetProfile":
                dispatcher = request.getRequestDispatcher("GetProfile");
                break;
            case "GetPostForm":
                oldSession = request.getSession(false);
                if (oldSession != null && oldSession.getAttribute("username") != null) {
                    dispatcher = request.getRequestDispatcher("WEB-INF/post_form.jsp");
                }
                else {
                    response.setContentType("application/json;charset=UTF-8");
                    PrintWriter out = response.getWriter();
                    json.put("ERROR", "NO_SESSION");
                    out.print(json.toJSONString());
                    response.setStatus(401);
                    return;
                }
                break;
            case "GetPosts":
                dispatcher = request.getRequestDispatcher("GetPosts");
                break;
            case "CreatePost":
                dispatcher = request.getRequestDispatcher("CreatePost");
                break;
            case "DeletePost":
                dispatcher = request.getRequestDispatcher("DeletePost");
                break;
            case "DeleteAccount":
                dispatcher = request.getRequestDispatcher("DeleteAccount");
                break;
            case "RatePost":
                dispatcher = request.getRequestDispatcher("RatePost");
                break;
            case "Logout":
                oldSession = request.getSession(false);
                if (oldSession != null) {
                    oldSession.invalidate();
                }
                dispatcher = request.getRequestDispatcher("Init");
                break;
            default:
                response.setContentType("application/json;charset=UTF-8");
                PrintWriter out = response.getWriter();
                json.put("INVALID_PARAMETERS", "action");
                out.print(json.toJSONString());
                response.setStatus(400);
                return;
        }
        if (dispatcher != null) {
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
        processRequest(request, response);
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
        processRequest(request, response);
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