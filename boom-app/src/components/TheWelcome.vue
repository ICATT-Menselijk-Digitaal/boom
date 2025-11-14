<template>
  <div class="flex column box">
    <p>BOOM stands for <b>B</b>ulk <b>O</b>verige <b>O</b>bjecten <b>M</b>apping</p>
    <p>You can use this app to add new objects in bulk into a Overige Objecten database.</p>
    <p>You will walk through the following steps:</p>
    <ol>
      <li>You will start with uploading a CSV file of the data that needs to be addded.</li>
      <li>
        The second step is to select the Object-type and -version that describes the format of your
        new objects.
      </li>
      <li>
        Then a mapping will be done by selected which column of the CSV data matches the selected
        Objecttype properties.
      </li>
      <li>
        Before entering new objects, a preview will be displayed to check if the mapping was done
        correctly.
      </li>
    </ol>
    <p>Be aware: type checking on entries is not done in this version of the BOOM-app.</p>
    <p>It is up to the user to make sure the CSV values are all of the correct type.</p>
    <p>To start press the <b>Next</b> button</p>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
