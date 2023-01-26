<?php
 
  // Replace contact@example.com with your real receiving email address
  $receiving_email_address = 'onyxsiocv@gmail.com';
// ../assets/vendor/php-email-form/php-email-form.php
  if( file_exists($php_email_form = '../mail/vendor/autoload.php' )) {
    include( $php_email_form );
  } else {
    die( 'Unable to load the "PHP Email Form" Library!');
  }

  $contact = new PHP_Email_Form;
  $contact->ajax = true;
  
  


  $contact->to = $receiving_email_address;
  $contact->from_name = $_POST['name'];
  $contact->from_email = $_POST['email'];
  $contact->subject = $_POST['subject'];

  // Uncomment below code if you want to use SMTP to send emails. You need to enter your correct SMTP credentials
  
  $contact->smtp = array(
    'host' => 'smtp.elasticemail.com',
    'username' => 'onyxsiocv@gmail.com',
    'password' => '7FD7A765BDCC914DD0624FFD6C1B700FE86A',
    'port' => '2525'
  );
  

  $contact->add_message( $_POST['name'], 'From');
  $contact->add_message( $_POST['email'], 'Email');
  $contact->add_message( $_POST['message'], 'Message', 10);

  $contact->recaptcha_secret_key = '6LfKpmwjAAAAAN8e3Zn1Quou9RM9tuiEDz1OlJaz';
  echo $contact->send();

?>
