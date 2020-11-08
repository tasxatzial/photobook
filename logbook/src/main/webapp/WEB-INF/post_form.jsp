<header>
  <h2>New Post</h2>
</header>
<div id="post-form">
  <div class="sign-child">
    <label for="post-form-description" class="sign-label signup-necessary">1. Description.</label>
    <textarea name="post-form-description" class="sign-tofill" id="post-form-description"></textarea>
  </div>
  <div class="sign-child">
    <p class="sign-label signup-necessary">2. Please enter a (latitude, longitude). You can use Geolocation or manually provide a Country/Place</p>
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
    <label for="post-form-online-page" class="sign-label">3. You may provide a link to an online page.</label>
    <input type="text" name="post-form-online-page" id="post-form-online-page" class="sign-tofill">
  </div>
  <div class="sign-child">
    <div class="sign-label">4. You may provide a link to an image. It can be an online image or you can select one from disk.</div>
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
    <button class="center-button" disabled>Create post</button>
    <div id="newpost-process-msg"></div>
  </div>
</div>