<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<div id="signup-section">
  <div id="signup-parent">
    <div id="signup-middle">
      <header>
        <h2><%= (String) request.getAttribute("title") %></h2>
      </header>
      <div id="signup">
        <div class="sign-child">
          <div class="flex-label">
            <label for="signup-username" class="signup-necessary sign-label">Username</label>
          </div>
          <input type="text" class="sign-tofill" value="<%= (String) request.getAttribute("username")%>" name="signup-username" id="signup-username" pattern="^[A-Za-z]{8,50}$" required>
          <p class="signup-require-info">8 to 50 characters, only letters</p>
        </div>
        <div class="sign-child" id="signup-photo-section">
          <p>
            <label class="sign-label"><input type="checkbox" disabled>
              Associate my username with a photo that may be used to identify me during the sign in process
            </label>
          </p>
        </div>
        <div class="sign-child">
          <div class="flex-label">
            <label for="signup-password" class="signup-necessary sign-label">Password</label>
          </div>
          <input type="password" class="sign-tofill" value="<%= (String) request.getAttribute("password")%>" name="signup-password" id="signup-password" pattern="^[\w0-9!#$%&'*+/=?^`{|}\[\]_\\~<>., -]{8,10}$" required>
          <p class="signup-require-info">8 to 10 characters</p>
        </div>
        <div class="sign-child">
          <div class="flex-label">
            <label for="signup-passwordConfirm" class="signup-necessary sign-label">Confirm Password</label>
          </div>
          <input type="password" class="sign-tofill" value="<%= (String) request.getAttribute("password")%>" name="signup-passwordConfirm" id="signup-passwordConfirm" required>
        </div>
        <div class="sign-child">
          <div class="flex-label">
            <label for="signup-email" class="signup-necessary sign-label">E-mail</label>
          </div>
          <input type="email" class="sign-tofill" value="<%= (String) request.getAttribute("email")%>" name="signup-email" id="signup-email"
                 pattern="^[\w!#$%&'*+/=?^`{|}~-]+(?:\.[\w!#$%&'*+/=?^`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$" required>
        </div>
        <div class="sign-child">
          <div class="flex-label">
            <label for="signup-firstName" class="signup-necessary sign-label">First name</label>
          </div>
          <input type="text" class="sign-tofill" value="<%= (String) request.getAttribute("firstName")%>" name="signup-firstName" id="signup-firstName" pattern="^[^0-9!#$%&'*+/=?^`{|}\[\]_\\~<>.,-]{3,15}$" required>
          <p class="signup-require-info">3 to 15 characters</p>
        </div>
        <div class="sign-child">
          <div class="flex-label">
            <label for="signup-lastName" class="signup-necessary sign-label">Last name</label>
          </div>
          <input type="text" class="sign-tofill" value="<%= (String) request.getAttribute("lastName")%>" name="signup-lastName" id="signup-lastName" pattern="^[^0-9!#$%&'*+/=?^`{|}\[\]_\\~<>.,-]{3,15}$" required>
          <p class="signup-require-info">3 to 15 characters</p>
        </div>
        <div class="sign-child">
          <div class="flex-label">
            <label for="signup-birthDate" class="signup-necessary sign-label">Date of Birth</label>
          </div>
          <input type="date" class="sign-tofill" value="<%= (String) request.getAttribute("birthDate")%>" name="signup-birthDate" id="signup-birthDate" required>
        </div>
        <div class="sign-child" id="signup-gender">
          <p class="sign-label">Gender</p>
          <ul>
            <li><label><input type="radio" name="signup-gender" value="Male" <%= request.getAttribute("male-checked") %>>Male</label></li>
            <li><label><input type="radio" name="signup-gender" value="Female" <%= request.getAttribute("female-checked") %>>Female</label></li>
            <li><label><input type="radio" name="signup-gender" value="Unknown" <%= request.getAttribute("unknown-checked") %>>It's a secret</label></li>
          </ul>
        </div>
        <div class="sign-child">
          <div class="flex-label">
            <label for="signup-job" class="signup-necessary sign-label">Occupation</label>
          </div>
          <input type="text" class="sign-tofill" value="<%= (String) request.getAttribute("job")%>" name="signup-job" id="signup-job" pattern="^[^0-9!#$%&'*+/=?^`{|}\[\]_\\~<>.,-]{3,15}$" required>
          <p class="signup-require-info">3 to 15 characters</p>
        </div>
        <div class="sign-child">
          <p class="sign-label">- You may detect your location or manually fill in the fields below</p>
          <div class="signup-geolocation-search">
            <button type="button" class="signup-geolocation-search-button sign-internal-button" disabled>Detect my location</button>
            <div class="sign-process-msg" id="signup-geolocation-search-state"></div>
          </div>
        </div>
        <div class="sign-child" id="signup-country-parent">
          <div class="flex-label">
            <p class="sign-label signup-necessary">Country</p>
            <div id="country-hidden" style="display: none"><%= request.getAttribute("country") %></div>
          </div>
          <jsp:include page="countries" />
        </div>
        <div class="sign-child">
          <div class="flex-label">
            <label for="signup-city" class="signup-necessary sign-label">City</label>
          </div>
          <input type="text" class="sign-tofill" value="<%= (String) request.getAttribute("city")%>" name="signup-city" id="signup-city" pattern="^[^!#$%&'*+/=?^`{|}\[\]_\\~<>.,]{2,20}$" required>
          <p class="signup-require-info">2 to 20 characters</p>
        </div>
        <div class="sign-child">
          <label for="signup-address" class="sign-label">Address</label><br>
          <input type="text" class="sign-tofill" value="<%= (String) request.getAttribute("address")%>" name="signup-address" id="signup-address">
        </div>
        <div class="sign-child">
          <p class="sign-label">- If the Country/City fields are filled in, you may find your location on a map</p>
          <div class="signup-location-search">
            <button type="button" class="signup-location-search-button sign-internal-button" disabled>Search my location</button>
            <div class="sign-process-msg" id="signup-location-search-state"></div>
          </div>
          <div id="signup-map-parent"></div>
        </div>
        <div class="sign-child" id="signup-interests-parent">
          <div class="flex-label">
            <p class="sign-label">Interests</p>
          </div>
          <textarea name="signup-interests" class="sign-tofill" rows="2" cols="50"><%= (String) request.getAttribute("interests")%></textarea>
        </div>
        <div class="sign-child">
          <div class="flex-label">
            <p class="sign-label">General information about you</p>
          </div>
          <textarea name="signup-about" class="sign-tofill" rows="5" cols="50"><%= (String) request.getAttribute("about")%></textarea>
        </div>
        <div class="sign-button" id="signup-button">
          <input type="button" value="<%= (String) request.getAttribute("button") %>" disabled>
          <div id="signupin-msg"></div>
        </div>
      </div>
    </div>
  </div>
</div>