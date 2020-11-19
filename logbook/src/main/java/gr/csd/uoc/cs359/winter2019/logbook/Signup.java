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
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.annotation.WebServlet;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpSession;

/**
 * Do a signup & update account info.
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
        PrintWriter out = response.getWriter();

        /* only Signup and UpdateAccount actions are accepted */
        if (request.getParameter("action") == null ||
                (!request.getParameter("action").equals("Signup") &&
                        !request.getParameter("action").equals("UpdateAccount"))) {
            jsonSignup.put("ERROR", "INVALID_ACTION");
            out.print(jsonSignup.toJSONString());
            response.setStatus(400);
            return;
        }

        /* For updating the account info, we need a valid session */
        String username = null;
        if (request.getParameter("action").equals("UpdateAccount")) {
            HttpSession oldSession = request.getSession(false);
            if (oldSession == null || oldSession.getAttribute("username") == null) {
                jsonSignup.put("ERROR", "NO_SESSION");
                out.print(jsonSignup.toJSONString());
                response.setStatus(401);
                return;
            }
            username = (String) oldSession.getAttribute("username");
        }

        jsonSignup = checkFields(request);

        String passwd1 = request.getParameter("password");
        Enumeration paramNames = request.getParameterNames();

        /* Check if the parameters of the request are valid */
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
                    break;
                case "passwordConfirm":
                    if (passwd1.matches(getRegexPattern("password")) &&
                            !passwd1.equals(paramValues[0])) {
                        jsonSignup.put(paramName, "Passwords don't match");
                    }
                    break;
                case "birthDate":
                    if (!isValidDate(paramValues[0])) {
                        jsonSignup.put(paramName, "Invalid pattern");
                    }
                    break;
                case "country":
                    if (Countries.getNameOf(paramValues[0]) == null) {
                        jsonSignup.put(paramName, "Invalid value");
                    }
                    break;
                case "interests":
                    if (paramValues[0].length() > 100) {
                        jsonSignup.put(paramName, "Exceeds maximum size (100)");
                    }
                    else if (paramValues[0].matches(getRegexPattern(paramName))) {
                        jsonSignup.put(paramName, "Invalid pattern");
                    }
                    break;
                case "about":
                    if (paramValues[0].length() > 500) {
                        jsonSignup.put(paramName, "Exceeds maximum size (500)");
                    }
                    else if (paramValues[0].matches(getRegexPattern(paramName))) {
                        jsonSignup.put(paramName, "Invalid pattern");
                    }
                    break;
                case "address":
                    if (paramValues[0].matches(getRegexPattern(paramName))) {
                        jsonSignup.put(paramName, "Invalid pattern");
                    }
                    break;
                default:
                    break;
            }
        }

        RequestDispatcher dispatcher;

        /* If the username is valid, check if it already exists on DB */
        if (jsonSignup.get("username") == null && request.getParameter("action").equals("Signup")) {
            request.setAttribute("parameter", "username");
            request.setAttribute("parameterValue", request.getParameter("username"));
            dispatcher = request.getRequestDispatcher("CheckOnDB");
            dispatcher.include(request, response);
            if (request.getAttribute("username").equals("0")) {
                jsonSignup.put("username", "Already taken");
            }
        }

        /* If the email is valid, check if it already exists on DB */
        if (jsonSignup.get("email") == null) {

            /* if we are performing signup, just check if the email exists on DB */
            if (request.getParameter("action").equals("Signup")) {
                request.setAttribute("parameter", "email");
                request.setAttribute("parameterValue", request.getParameter("email"));
                dispatcher = request.getRequestDispatcher("CheckOnDB");
                dispatcher.include(request, response);
                if (request.getAttribute("email").equals("0")) {
                    jsonSignup.put("email", "Already taken");
                }
            }

            /* if we are updating the account info, first make sure that the username parameter
            corresponds to an actual user */
            else {
                User user = UserDB.getUser(username);
                if (user != null) {
                    if (!request.getParameter("email").equals(user.getEmail())) {
                        request.setAttribute("parameter", "email");
                        request.setAttribute("parameterValue", request.getParameter("email"));
                        dispatcher = request.getRequestDispatcher("CheckOnDB");
                        dispatcher.include(request, response);
                        if (request.getAttribute("email").equals("0")) {
                            jsonSignup.put("email", "Already taken");
                        }
                    }
                }
                else {
                    JSONObject json = new JSONObject();
                    json.put("ERROR", "SERVER_ERROR");
                    out.print(json.toJSONString());
                    response.setStatus(500);
                    return;
                }
            }
        }

        /* Return an error if any of the request parameters are invalid */
        if (!jsonSignup.isEmpty()) {
            jsonSignup.put("ERROR", "INVALID_PARAMETERS");
            out.print(jsonSignup.toJSONString());
            response.setStatus(400);
        }
        else {
            doSignup(request, response);
        }
    }

    /**
     * Checks that the request has all the required parameters.
     * @param request
     * @return
     */
    protected JSONObject checkFields(HttpServletRequest request) {
        JSONObject json = new JSONObject();
        String[] fields = new String[]{
                "username", "password", "passwordConfirm", "email",
                "firstName", "lastName", "birthDate", "country", "city",
                "address", "job", "gender", "interests", "about" };

        for (int i = 0; i < fields.length; i++) {
            if (request.getParameter(fields[i]) == null) {
                json.put(fields[i], "Missing parameter");
            }
        }

        return json;
    }

    /**
     * Performs signup.
     * @param request
     * @param response
     * @throws IOException
     * @throws ClassNotFoundException
     */
    protected void doSignup(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ClassNotFoundException {

        /* create a User object using the request parameters */
        String r_username = request.getParameter("username");
        String r_password = request.getParameter("password");
        String r_email = request.getParameter("email");
        String r_firstName = request.getParameter("firstName");
        String r_lastName = request.getParameter("lastName");
        String r_birthDate = request.getParameter("birthDate");
        String r_country = request.getParameter("country");
        String r_city = request.getParameter("city");
        String r_address = request.getParameter("address");
        String r_job = request.getParameter("job");
        String r_gender = request.getParameter("gender");
        String r_interests = request.getParameter("interests");
        String r_about = request.getParameter("about");

        User user = new User();
        user.setUserName(r_username);
        user.setPassword(r_password);
        user.setEmail(r_email);
        user.setFirstName(r_firstName);
        user.setLastName(r_lastName);
        user.setBirthDate(r_birthDate);
        user.setCountry(r_country);
        user.setTown(r_city);
        user.setAddress(r_address);
        user.setOccupation(r_job);
        user.setGender(r_gender);
        user.setInterests(r_interests);
        user.setInfo(r_about);

        /* either update user's account info, or do a signup */
        if (request.getParameter("action").equals("UpdateAccount")) {
            UserDB.updateUser(user);
        }
        else {
            UserDB.addUser(user);
        }

        /* verify that the user info has been written on DB */
        user = UserDB.getUser(request.getParameter("username"));
        JSONObject jsonSignup = new JSONObject();
        PrintWriter out = response.getWriter();
        if (user != null) {
            String username = user.getUserName();
            String password = user.getPassword();
            String email = user.getEmail();
            String firstName = user.getFirstName();
            String lastName = user.getLastName();
            String birthDate = user.getBirthDate().substring(0, 10);
            String country = user.getCountry();
            String city = user.getTown();
            String address = user.getAddress();
            String job = user.getOccupation();
            String gender = user.getGender().toString();
            String interests = user.getInterests();
            String about = user.getInfo();
            if (r_username.equals(username) &&
                r_password.equals(password) &&
                r_email.equals(email) &&
                r_firstName.equals(firstName) &&
                r_lastName.equals(lastName) &&
                r_birthDate.equals(birthDate) &&
                r_country.equals(country) &&
                r_city.equals(city) &&
                r_address.equals(address) &&
                r_job.equals(job) &&
                r_gender.equals(gender) &&
                r_interests.equals(interests) &&
                r_about.equals(about)) {
                if (request.getParameter("action").equals("Signup")) {
                    jsonSignup.put("username", username);
                    jsonSignup.put("email", email);
                    jsonSignup.put("firstName", firstName);
                    jsonSignup.put("lastName", lastName);
                    jsonSignup.put("birthDate", birthDate);
                    jsonSignup.put("country", Countries.getNameOf(country));
                    jsonSignup.put("city", city);
                    jsonSignup.put("address", address);
                    jsonSignup.put("job", job);
                    jsonSignup.put("gender", gender);
                    jsonSignup.put("interests", interests);
                    jsonSignup.put("about", about);
                }
                out.print(jsonSignup.toJSONString());
            }
            else {
                JSONObject json = new JSONObject();
                json.put("ERROR", "SERVER_ERROR");
                out.print(json.toJSONString());
                response.setStatus(500);
            }
        } else {
            JSONObject json = new JSONObject();
            json.put("ERROR", "SERVER_ERROR");
            out.print(json.toJSONString());
            response.setStatus(500);
        }
    }

    /**
     * Checks whether the specified date conforms to the format yyyy-MM-dd.
     * @param date
     * @return
     */
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

    /**
     * Returns the regex pattern for the specified field request parameter.
     * @param field
     * @return
     */
    protected String getRegexPattern(String field) {
        switch(field) {
            case "username":
                return "^[A-Za-z]{8,50}$";
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
            case "address":
            case "interests":
            case "about":
                return ".*<.*=?.*>.*";
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