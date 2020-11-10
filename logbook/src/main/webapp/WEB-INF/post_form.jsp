<header>
  <h2>New Post</h2>
</header>
<p class="step-required-asterisk">(<span>*</span>) Required</p>
<div id="post-form">
  <div class="sign-child">
    <label for="post-form-description" class="sign-label sign-top-label signup-necessary">1. Description of your location.</label>
    <textarea name="post-form-description" class="sign-tofill" id="post-form-description"></textarea>
  </div>
  <div class="sign-child">
    <p class="sign-label signup-necessary sign-top-label">2. Please enter the (latitude, longitude) of your location. You can detect it using either of the methods below.</p>
    <div class="post-form-options" id="post-form-location-choose">
      <label class="sign-label"><input type="radio" name="detect-method" id="post-form-auto-detect" checked>Geolocation</label><br>
      <label class="sign-label"><input type="radio" name="detect-method" id="post-form-place-detect">Country/Place</label>
    </div>
    <div id="post-form-country-hidden" style="display: none">
      <div class="sign-child">
        <p class="sign-label signup-necessary">Country</p>
        <jsp:include page="countries" />
      </div>
      <div class="sign-child" id="post-form-place-parent">
        <label for="post-form-place" class="sign-label signup-necessary">Place</label>
        <input type="text" name="post-form-place" id="post-form-place" class="sign-tofill">
        <p class="signup-require-info">City and/or address and/or place</p>
      </div>
    </div>
    <div id="post-form-detect">
      <div id="flex-post-location">
        <button type="button" class="sign-internal-button" id="post-form-detect-button" disabled>Detect my location</button>
        <div id="post-form-detect-msg"></div>
      </div>
    </div>
  </div>
  <div class="sign-child">
    <label for="post-form-online-page" class="sign-label sign-top-label">3. You may provide a link to an online page related to your location.</label>
    <input type="text" name="post-form-online-page" id="post-form-online-page" class="sign-tofill">
  </div>
  <div class="sign-child">
    <div class="sign-label sign-top-label">4. You may provide an image related to your location. Choose either of the options below.</div>
    <div class="post-form-options">
      <div id="select-online-photo">
        <label class="sign-label"><input type="checkbox">Online image</label>
        <input type="text" class="sign-tofill" name="post-form-online-image" id="post-form-online-image" style="display: none">
      </div>
      <div id="select-disk-photo">
        <button type="button" class="sign-internal-button" id="post-form-disk-select" disabled>Select from disk</button>
        <input type="file" name="post-form-disk-image" style="display: none">
        <div id="post-form-photo-parent"></div>
      </div>
    </div>
  </div>
  <div class="sign-button" id="post-button">
    <button class="main-button center-button" disabled>Create post</button>
  </div>
  <div id="newpost-process-msg"></div>
</div>