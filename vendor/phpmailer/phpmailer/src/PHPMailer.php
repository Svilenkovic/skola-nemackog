<?php
namespace PHPMailer\PHPMailer;

class PHPMailer
{
    const ENCRYPTION_STARTTLS = 'tls';
    const ENCRYPTION_SMTPS = 'ssl';
    
    public $Host = '';
    public $Port = 25;
    public $SMTPAuth = false;
    public $Username = '';
    public $Password = '';
    public $SMTPSecure = '';
    public $From = '';
    public $FromName = '';
    public $Subject = '';
    public $Body = '';
    public $AltBody = '';
    public $isHTML = false;
    public $addAddress = [];
    public $addReplyTo = [];
    public $ErrorInfo = '';
    public $SMTPDebug = 0;
    
    public function isSMTP()
    {
        return true;
    }
    
    public function addAddress($address, $name = '')
    {
        $this->addAddress[] = ['address' => $address, 'name' => $name];
        return $this;
    }
    
    public function addReplyTo($address, $name = '')
    {
        $this->addReplyTo[] = ['address' => $address, 'name' => $name];
        return $this;
    }
    
    public function setFrom($address, $name = '')
    {
        $this->From = $address;
        $this->FromName = $name;
        return $this;
    }
    
    public function send()
    {
        if (empty($this->Host) || empty($this->Username) || empty($this->Password)) {
            $this->ErrorInfo = 'SMTP configuration is incomplete';
            return false;
        }
        
        if (empty($this->addAddress)) {
            $this->ErrorInfo = 'No recipients specified';
            return false;
        }
        
        $headers = [];
        $headers[] = 'From: ' . $this->FromName . ' <' . $this->From . '>';
        
        if (!empty($this->addReplyTo)) {
            $headers[] = 'Reply-To: ' . $this->addReplyTo[0]['address'];
        }
        
        $headers[] = 'Content-Type: ' . ($this->isHTML ? 'text/html' : 'text/plain') . '; charset=UTF-8';
        $headers[] = 'X-Mailer: PHPMailer';
        
        $to = implode(', ', array_map(function($recipient) {
            return $recipient['name'] ? $recipient['name'] . ' <' . $recipient['address'] . '>' : $recipient['address'];
        }, $this->addAddress));
        
        return mail($to, $this->Subject, $this->Body, implode("\r\n", $headers));
    }
}
