/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.csd.uoc.cs359.winter2019.logbook;

import gr.csd.uoc.cs359.winter2019.logbook.db.PostDB;
import gr.csd.uoc.cs359.winter2019.logbook.db.UserDB;
import gr.csd.uoc.cs359.winter2019.logbook.model.Post;
import org.json.simple.JSONObject;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.annotation.WebServlet;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpSession;


@WebServlet(name = "DeletePost", urlPatterns = "/DeletePost")
@MultipartConfig
public class DeletePost extends HttpServlet {

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

        String i_username = (String) request.getAttribute("username");
        if (i_username != null) {
            PostDB.deleteAllPostsBy(UserDB.getUser(i_username));
            List<Post> posts = PostDB.getTop10RecentPostsOfUser(i_username);
            if (posts.size() > 0) {
                request.setAttribute("DELETE_POSTS", "0");
            }
            else {
                request.setAttribute("DELETE_POSTS", "1");
            }
        }
        else {
            response.setContentType("application/json;charset=UTF-8");
            PrintWriter out = response.getWriter();
            JSONObject jsonFinal = new JSONObject();

            HttpSession oldSession = request.getSession(false);
            if (oldSession == null || oldSession.getAttribute("username") == null) {
                jsonFinal.put("ERROR", "NO_SESSION");
                out.print(jsonFinal.toJSONString());
                response.setStatus(401);
                return;
            }
            String r_username = request.getParameter("username");
            if (r_username == null) {
                jsonFinal.put("ERROR", "MISSING_USERNAME");
                out.print(jsonFinal.toJSONString());
                response.setStatus(400);
                return;
            }
            String s_username = (String) oldSession.getAttribute("username");
            if (!r_username.equals(s_username)) {
                jsonFinal.put("ERROR", "UNAUTHORIZED");
                response.setStatus(401);
                out.print(jsonFinal.toJSONString());
                return;
            }
            String postID = request.getParameter("postID");
            if (postID == null) {
                jsonFinal.put("ERROR", "MISSING_POSTID");
                response.setStatus(400);
                out.print(jsonFinal.toJSONString());
                return;
            }
            int pID;
            try {
                pID = Integer.parseInt(postID);
            }
            catch (NumberFormatException e) {
                jsonFinal.put("ERROR", "INVALID_POSTID");
                response.setStatus(400);
                out.print(jsonFinal.toJSONString());
                return;
            }

            Post post = PostDB.getPost(pID);
            if (post == null) {
                jsonFinal.put("ERROR", "INVALID_POST");
                out.print(jsonFinal.toJSONString());
                response.setStatus(400);
                return;
            }

            PostDB.deletePost(pID);
            post = PostDB.getPost(pID);

            if (post != null) {
                jsonFinal.put("ERROR", "DELETE_POST");
                out.print(jsonFinal.toJSONString());
                response.setStatus(500);
            }
            else {
                out.print(jsonFinal.toJSONString());
            }
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