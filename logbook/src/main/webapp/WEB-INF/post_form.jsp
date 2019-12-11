<header>
  <h2>New Post</h2>
</header>
<div class="sign-child">
  <div class="flex-label">
    <p class="sign-label signup-necessary">1. Description.</p>
  </div>
  <textarea class="sign-tofill" id="post-form-description"></textarea>
</div>
<div class="sign-child">
  <p class="sign-label signup-necessary">2. Please provide a (latitude, longitude). You can either use autodetection or provide a country/place.</p>
  <div class="post-form-options">
    <label class="sign-label"><input type="radio" name="detect-method">Autodetect</label><br>
    <label class="sign-label"><input type="radio" name="detect-method">Country/Place</label>
  </div>
  <button type="button" class="sign-internal-button" disabled>Detect my location</button>
  <div id="country-place-hidden" style="display: none">
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
</div>
<div class="sign-child">
  <p class="sign-label">3. You may provide a link to an online page.</p>
  <input type="text" class="sign-tofill">
</div>
<div class="sign-child">
  <div class="sign-label">4. You may provide a link to an image. It can be an online image or you can select one from disk.</div>
  <div class="post-form-options">
    <div id="select-online-photo">
      <label class="sign-label"><input type="radio">Online image</label>
      <input type="text" class="sign-tofill" style="display: none">
    </div>
    <div id="select-disk-photo">
      <button type="button" class="sign-internal-button" id="post-form-disk-select">Select from disk</button>
      <input type="file" style="display: none">
      <div id="post-form-photo-container"></div>
    </div>
  </div>
</div>
<div class="sign-button" id="post-button">
  <input type="button" value="Create post" disabled>
  <div id="signupin-msg"></div>
</div>