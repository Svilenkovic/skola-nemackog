<?php
require_once 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method not allowed');
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');

$errors = [];

if (empty($name)) {
    $errors[] = 'Ime i prezime je obavezno';
}

if (empty($email)) {
    $errors[] = 'Email adresa je obavezna';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Unesite validnu email adresu';
}

if (empty($phone)) {
    $errors[] = 'Broj telefona je obavezan';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Molimo popunite sva obavezna polja.',
        'errors' => $errors
    ]);
    exit;
}

$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$phone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

$smtpHost = getenv('SMTP_HOST') ?: 'smtp.example.com';
$smtpPort = (int) (getenv('SMTP_PORT') ?: 587);
$smtpUsername = getenv('SMTP_USERNAME') ?: '';
$smtpPassword = getenv('SMTP_PASSWORD') ?: '';
$smtpEncryption = getenv('SMTP_ENCRYPTION') ?: PHPMailer::ENCRYPTION_STARTTLS;
$smtpFromEmail = getenv('SMTP_FROM_EMAIL') ?: 'noreply@example.com';
$smtpFromName = getenv('SMTP_FROM_NAME') ?: 'Website Contact';
$contactReceiverEmail = getenv('CONTACT_RECEIVER_EMAIL') ?: 'admin@example.com';

function sendEmail($to, $subject, $body, $replyTo = null) {
    global $smtpHost, $smtpPort, $smtpUsername, $smtpPassword, $smtpEncryption, $smtpFromEmail, $smtpFromName;

    $mail = new PHPMailer();
    
    $mail->isSMTP();
    $mail->Host = $smtpHost;
    $mail->SMTPAuth = !empty($smtpUsername) && !empty($smtpPassword);
    if ($mail->SMTPAuth) {
        $mail->Username = $smtpUsername;
        $mail->Password = $smtpPassword;
    }
    $mail->SMTPSecure = $smtpEncryption;
    $mail->Port = $smtpPort;
    
    $mail->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        )
    );
    
    $mail->setFrom($smtpFromEmail, $smtpFromName);
    $mail->addAddress($to);
    
    if ($replyTo && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
        $mail->addReplyTo($replyTo);
    }
    
    $mail->isHTML = true;
    $mail->Subject = $subject;
    $mail->Body = $body;
    
    return $mail->send();
}

$admin_subject = 'Nova poruka sa sajta - Škola Nemačkog Jezika';
$admin_body = "
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #f8f9fa; padding: 20px; border-bottom: 3px solid #007bff; }
        .content { padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #007bff; }
        .value { margin-left: 10px; }
        .footer { background-color: #f8f9fa; padding: 15px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class='header'>
        <h2>Nova poruka sa sajta</h2>
        <p>Škola Nemačkog Jezika</p>
    </div>
    
    <div class='content'>
        <div class='field'>
            <span class='label'>Ime i prezime:</span>
            <span class='value'>{$name}</span>
        </div>
        
        <div class='field'>
            <span class='label'>Email:</span>
            <span class='value'>{$email}</span>
        </div>
        
        <div class='field'>
            <span class='label'>Telefon:</span>
            <span class='value'>{$phone}</span>
        </div>
        
        <div class='field'>
            <span class='label'>Poruka:</span>
            <div class='value'>{$message}</div>
        </div>
    </div>
    
    <div class='footer'>
        <p><strong>Poslato:</strong> " . date('d.m.Y H:i:s') . "</p>
        <p><strong>IP adresa:</strong> " . $_SERVER['REMOTE_ADDR'] . "</p>
    </div>
</body>
</html>
";

$user_subject = 'Potvrda poruke - Škola Nemačkog Jezika';
$user_body = "
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #f8f9fa; padding: 20px; border-bottom: 3px solid #007bff; }
        .content { padding: 20px; }
        .footer { background-color: #f8f9fa; padding: 15px; font-size: 12px; color: #666; }
        .contact-info { background-color: #e9ecef; padding: 15px; margin: 20px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <div class='header'>
        <h2>Hvala vam na interesovanju!</h2>
        <p>Škola Nemačkog Jezika</p>
    </div>
    
    <div class='content'>
        <p>Poštovani/a <strong>{$name}</strong>,</p>
        
        <p>Hvala vam na interesovanju za naše kurseve nemačkog jezika!</p>
        
        <p>Vaša poruka je uspešno primljena i odgovorićemo vam u najkraćem mogućem roku.</p>
        
        <div class='contact-info'>
            <h3>Detalji vaše poruke:</h3>
            <p><strong>Poruka:</strong> {$message}</p>
        </div>
        
        <p>Sa poštovanjem,<br>
        <strong>Tim Škole Nemačkog Jezika</strong></p>
    </div>
    
    <div class='footer'>
        <p>Ova poruka je automatska potvrda prijema vašeg upita.</p>
        <p>Template by: <a href='https://svilenkovic.com'>svilenkovic.com</a></p>
    </div>
</body>
</html>
";

$admin_sent = sendEmail($contactReceiverEmail, $admin_subject, $admin_body, $email);
$user_sent = sendEmail($email, $user_subject, $user_body);

if ($admin_sent && $user_sent) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Poruka je uspešno poslata! Kontaktiraćemo vas u najkraćem mogućem roku.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Došlo je do greške prilikom slanja poruke. Molimo pokušajte ponovo kasnije.'
    ]);
}
?> 