/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.csd.uoc.cs359.winter2020.photobook.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 *
 * @author papadako
 */
public class CS359DB {

    private static final String URL = "jdbc:postgresql://127.0.0.1";
    private static final String DATABASE = "photobook";
    private static final int PORT = 5432;
    private static final String UNAME = "photobook"; // create this role in db
    private static final String PASSWD = "HTs#hM6D";

    /**
     * Attempts to establish a database connection.
       *
     * @return a connection to the database
     * @throws SQLException
     * @throws java.lang.ClassNotFoundException
     */
    public static Connection getConnection() throws SQLException, ClassNotFoundException {
        Class.forName("org.postgresql.Driver");
        return DriverManager.getConnection(URL + ":" + PORT + "/" + DATABASE, UNAME, PASSWD);
    }

    public static String getUserName() {
        return UNAME;
    }
}
