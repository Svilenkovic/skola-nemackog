<?php
namespace PHPMailer\PHPMailer;

class SMTP
{
    public $do_verp = false;
    public $do_verp = false;
    
    public function connect($host, $port = null, $timeout = 30, $options = array())
    {
        return true;
    }
    
    public function authenticate($username, $password, $authtype = null, $realm = '', $workstation = '', $token = null)
    {
        return true;
    }
    
    public function data($msg_data)
    {
        return true;
    }
    
    public function quit($close_on_error = true)
    {
        return true;
    }
}
