<div class="sign-child">
  <div class="flex-label">
    <p class="sign-label signup-necessary">1. Description.</p>
  </div>
  <textarea class="sign-tofill" id="post-description"></textarea>
</div>
<div class="sign-child">
  <p class="sign-label signup-necessary">2. Please provide a (latitude, longitude). You can either use autodetection or detect it by providing a country/place.</p>
  <div class="signup-geolocation-search">
    <div class="signup-geolocation-search-content">
      <label class="sign-label"><input type="radio" name="detect-method">Autodetect</label>
      <label class="sign-label"><input type="radio" name="detect-method" id="country-detect">Country/Place</label>
    </div>
    <div id="country-place-hidden">
      <div class="sign-child">
        <p class="sign-label signup-necessary">Country</p>
        <jsp:include page="countries" />
      </div>
      <div class="sign-child">
        <p class="sign-label signup-necessary">Place</p>
        <input type="text" class="sign-tofill">
        <p class="signup-require-info">City and/or address and/or place</p>
      </div>
    </div>
    <button type="button" class="signup-geolocation-search-button sign-internal-button" disabled>Detect my location</button>
    <div class="sign-process-msg" id="signup-geolocation-search-state"></div>
  </div>
</div>
<div class="sign-child">
  <p class="sign-label">3. You may provide a link to an online page.</p>
  <input type="text" class="sign-tofill">
</div>
<div class="sign-child">
  <p class="sign-label">4. You may provide a link to an image. It can be an online image or you can select one from disk.</p>
  <div class="signup-location-search">
    <div class="signup-location-search-content">
      <label class="sign-label"><input type="radio" name="detect-method">Select from disk</label>
      <label class="sign-label"><input type="radio" name="detect-method">Online image</label>
    </div>
    <div class="sign-child">
      <p class="sign-label">Online image:</p>
      <input type="text" class="sign-tofill">
    </div>
  </div>
</div>
<div class="sign-button" id="post-button">
  <input type="button" value="Create post" disabled>
  <div id="signupin-msg"></div>
</div>