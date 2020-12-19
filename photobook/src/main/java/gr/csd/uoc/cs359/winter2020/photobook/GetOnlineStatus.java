package gr.csd.uoc.cs359.winter2020.photobook;

import gr.csd.uoc.cs359.winter2020.photobook.model.OnlineUsers;
import org.json.simple.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Gets the online status of a list of users
 */
@WebServlet(name = "GetOnlineStatus", urlPatterns = "/GetOnlineStatus")
@MultipartConfig
public class GetOnlineStatus extends HttpServlet {

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
        JSONObject json = new JSONObject();
        PrintWriter out = response.getWriter();

        /* we need a valid session */
        HttpSession oldSession = request.getSession(false);
        if (oldSession == null || oldSession.getAttribute("username") == null) {
            json.put("ERROR", "NO_SESSION");
            out.print(json.toJSONString());
            response.setStatus(401);
            return;
        }

        String username = (String) oldSession.getAttribute("username");
        OnlineUsers.addUser(username);

        if (request.getParameter("users") == null) {
            json.put("ERROR", "MISSING_USERS_LIST");
            out.print(json.toJSONString());
            response.setStatus(400);
            return;
        }

        String[] userList = request.getParameterValues("users");

        for (String s : userList) {
            if (OnlineUsers.isUserOnline(s)) {
                json.put(s, "1");
            } else {
                json.put(s, "0");
            }
        }
        out.print(json.toJSONString());
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
