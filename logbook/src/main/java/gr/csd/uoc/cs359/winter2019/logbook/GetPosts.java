/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.csd.uoc.cs359.winter2019.logbook;

import gr.csd.uoc.cs359.winter2019.logbook.db.PostDB;
import gr.csd.uoc.cs359.winter2019.logbook.model.Post;
import org.json.simple.JSONObject;

import java.io.Console;
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


@WebServlet(name = "GetPosts", urlPatterns = "/GetPosts")
@MultipartConfig
public class GetPosts extends HttpServlet {

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

        HttpSession oldSession = request.getSession(false);
        if (oldSession == null || oldSession.getAttribute("username") == null) {
            jsonFinal.put("ERROR", "NO_SESSION");
            out.print(jsonFinal.toJSONString());
            return;
        }

        String username = request.getParameter("username");

        List<Post> posts;
        if (username.equals("0")) {
            posts = PostDB.getTop10RecentPosts();
        }
        else if (username.equals("")) {
            posts = PostDB.getTop10RecentPostsOfUser((String) oldSession.getAttribute("username"));
        }
        else {
            posts = PostDB.getTop10RecentPostsOfUser(username);
        }

        Post post;
        JSONObject json;

        for (int i = 0; i < posts.size(); i++) {
            post = posts.get(i);
            json = new JSONObject();
            json.put("userName", post.getUserName());
            json.put("description", post.getDescription());
            if (isValidURL(post.getResourceURL())) {
                json.put("resourceURL", post.getResourceURL());
            }
            if (isValidURL(post.getImageURL())) {
                json.put("imageURL", post.getImageURL());
            }
            else if (isValidImageBase64(post.getImageBase64())) {
                json.put("imageBase64", post.getImageBase64());
            }
            json.put("latitude", post.getLatitude());
            json.put("longitude", post.getLongitude());
            json.put("createdAt", post.getCreatedAt());
            json.put("postID", post.getPostID());
            jsonFinal.put(Integer.toString(i), json);
        }
        out.println(jsonFinal.toJSONString());
    }

    protected Boolean isValidImageBase64(String image) {
        String trimmedImage = image.trim();
        if (!trimmedImage.equals("")) {
            String img[] = image.split(",");
            if (img[0].equals("data:image/jpeg;base64") || img[0].equals("data:image/png;base64")) {
                return img.length > 1 && !img[1].matches("[^A-Za-z0-9+/=]");
            }
        }
        return false;
    }

    protected Boolean isValidURL(String imageURL) {
        String trimmedURL = imageURL.trim();
        int trimmedURLLength = trimmedURL.length();
        if (trimmedURLLength < 7 ||
                (!trimmedURL.substring(0, 7).equals("http://") && !trimmedURL.substring(0, 8).equals("https://") && !trimmedURL.substring(0, 4).equals("www."))) {
            return false;
        }

        return true;
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