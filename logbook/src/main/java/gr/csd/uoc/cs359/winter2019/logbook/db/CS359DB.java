/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.csd.uoc.cs359.winter2019.logbook.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 *
 * @author papadako
 */
public class CS359DB {

    private static final String URL = "jdbc:postgresql://127.0.0.1";
    private static final String DATABASE = "logbook";
    private static final int PORT = 5432;
    private static final String UNAME = "csd3902"; // Share your repo to give you the credentials
    private static final String PASSWD = "RU++2BW+";  // Share your repo to give you the credentials

    /**
     * Attempts to establish a database connection Using mariadb
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
