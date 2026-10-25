// Each case contains a scenario and three evidence-based questions.
// These fictional scenarios teach security concepts; they do not inspect live traffic.
const cases = [
  {
    level: 1, title: 'The Urgent Account Warning',
    scenario: 'From: Security Desk <security@paypaI-alert.example>\nSubject: Your account will close in 30 minutes\n\nVerify immediately: https://paypal-verify.example/login',
    hint: 'Look at the actual domain rather than the brand name displayed in the message.',
    questions: [
      {q:'Classify this email.',options:['Legitimate','Phishing attempt','Cannot tell anything'],answer:1,why:'It impersonates a brand and directs users to an unrelated login domain.'},
      {q:'What is the strongest clue?',options:['It is urgent','The sender and link domains do not match the claimed service','It includes HTTPS'],answer:1,why:'Lookalike domains are stronger evidence than urgency alone. HTTPS does not prove legitimacy.'},
      {q:'What should you do?',options:['Open the link','Reply with your password','Report it and check via a trusted app or website'],answer:2,why:'Verify independently instead of using links in a suspicious email.'}
    ]
  },
  {
    level:1,title:'A Routine Calendar Invite',
    scenario:'From: Events <events@training.example>\nSubject: Workshop schedule\n\nThe timetable is attached as a PDF. No sign-in or payment is requested. Sender is already known to the team.',
    hint:'Not every attachment or email is malicious. What evidence do you actually have?',
    questions:[
      {q:'How should this be classified from the available facts?',options:['Definitely malicious','No clear sign of phishing, but verify before opening','Guaranteed safe'],answer:1,why:'A known sender and ordinary content reduce suspicion but cannot guarantee safety.'},
      {q:'Which claim is unjustified?',options:['Attachments may need checking','Sender identity can be spoofed','PDF files can never be malicious'],answer:2,why:'PDFs can carry harmful content or links; file type alone is not proof of safety.'},
      {q:'Best next step?',options:['Open it without checking','Confirm the invite and scan the attachment if needed','Send your password to the sender'],answer:1,why:'Independent confirmation and routine attachment checks are proportionate safeguards.'}
    ]
  },
  {
    level:1,title:'The Gift Card Request',
    scenario:'From: "CEO" <ceo-office@external-mail.example>\nSubject: Confidential task\n\nBuy gift cards urgently and send me the codes. Do not tell finance.',
    hint:'Think about unusual payment requests and impersonation.',
    questions:[
      {q:'Most likely threat?',options:['Business email compromise / impersonation','Software update','Normal procurement'],answer:0,why:'The message impersonates an executive to induce an unauthorized payment.'},
      {q:'Strongest warning sign?',options:['Short email','Unusual secret gift-card payment request','It has a subject line'],answer:1,why:'Gift-card purchases combined with secrecy are a strong social engineering indicator.'},
      {q:'Safest response?',options:['Buy the cards','Confirm with the executive through a known channel','Forward the codes to finance'],answer:1,why:'Out-of-band verification defeats many impersonation attempts.'}
    ]
  },
  {
    level:1,title:'The Unexpected OTP',
    scenario:'SMS: "Your verification code is 483921. A support agent will call to collect it."\nYou did not request a login.',
    hint:'One-time passwords are authentication secrets.',
    questions:[
      {q:'What is the main risk?',options:['Credential or OTP theft','Slow internet','Expired certificate'],answer:0,why:'A scammer may be trying to bypass multi-factor authentication.'},
      {q:'Which fact matters most?',options:['It is an SMS','A stranger requests an OTP you did not initiate','It contains digits'],answer:1,why:'Legitimate support staff should not ask you to disclose one-time login codes.'},
      {q:'Best action?',options:['Share the code','Ignore/report the request and check account activity','Post the OTP publicly'],answer:1,why:'Keep authentication secrets private and investigate unexpected login activity.'}
    ]
  },
  {
    level:1,title:'The QR Code Poster',
    scenario:'A poster near a campus entrance says "Free Wi-Fi access: scan this QR". The QR opens https://campus-wifi-login.example and requests your university password.',
    hint:'QR codes hide the destination until scanned.',
    questions:[
      {q:'How should this be treated?',options:['Definitely official','Potential credential phishing','Automatically safe because it is printed'],answer:1,why:'A physical poster can lead to a fake login page.'},
      {q:'Which clue should be verified?',options:['Poster color','Whether the domain belongs to the university','QR image size'],answer:1,why:'The destination domain should match an independently confirmed official service.'},
      {q:'Safest action?',options:['Enter credentials','Confirm the Wi-Fi setup with university IT','Share the QR with everyone'],answer:1,why:'Verify the official Wi-Fi onboarding instructions before entering credentials.'}
    ]
  },
  {
    level:2,title:'Subdomain Trick',
    scenario:'Link: https://bank.example.attacker-site.example/login\nThe page displays a familiar bank logo and a padlock icon.',
    hint:'Read hostnames from right to left to identify the registrable domain.',
    questions:[
      {q:'Which site controls this URL?',options:['bank.example','attacker-site.example','Both equally'],answer:1,why:'bank.example is only a subdomain prefix under attacker-site.example.'},
      {q:'Does the padlock prove the bank owns the site?',options:['Yes','No, HTTPS only authenticates the connection to the named host','Only on mobile'],answer:1,why:'TLS can protect a connection to a malicious site.'},
      {q:'What should you do?',options:['Log in','Use the bank app or a bookmarked official URL','Disable browser security'],answer:1,why:'Navigate through a known trusted route.'}
    ]
  },
  {
    level:2,title:'HTTP Login Page',
    scenario:'A login form appears at http://portal.example/login and requests a password. The browser warns "Not secure".',
    hint:'What does HTTPS protect during transport?',
    questions:[
      {q:'Main network security issue?',options:['The page uses HTTP without TLS','The URL is too short','It uses a form'],answer:0,why:'Plain HTTP does not provide TLS transport encryption.'},
      {q:'What might an on-path observer obtain?',options:['Only screen brightness','Sensitive data transmitted without encryption','The device serial number automatically'],answer:1,why:'Unencrypted requests can expose submitted credentials to an on-path attacker.'},
      {q:'Safest choice?',options:['Enter the password','Find a verified HTTPS service or contact its administrator','Ignore the warning'],answer:1,why:'Do not send credentials over an unencrypted connection.'}
    ]
  },
  {
    level:2,title:'Certificate Warning',
    scenario:'You visit a company portal. The browser says the TLS certificate name does not match the website hostname.',
    hint:'TLS certificates bind a public key to a hostname or identity.',
    questions:[
      {q:'What does the warning mean?',options:['Hostname identity could not be verified','The site must be fast','The site uses UDP'],answer:0,why:'A name mismatch prevents normal certificate-based hostname verification.'},
      {q:'Best explanation?',options:['Encryption alone guarantees identity','TLS checks certificate identity as well as protecting transport','DNS and TLS are identical'],answer:1,why:'TLS validation helps ensure the server is the intended host.'},
      {q:'Safest action?',options:['Bypass the warning','Stop and confirm the address with IT','Submit credentials anyway'],answer:1,why:'Unexpected certificate warnings should be investigated.'}
    ]
  },
  {
    level:2,title:'DNS Redirection Alert',
    scenario:'A fictional monitoring system reports: intranet.example normally resolves to 192.0.2.20 but suddenly resolves to 203.0.113.99. There is no approved change request.',
    hint:'DNS maps hostnames to addresses, but changes can be legitimate or suspicious.',
    questions:[
      {q:'Best initial classification?',options:['Possible DNS misconfiguration or tampering','Confirmed malware infection','Definitely safe'],answer:0,why:'Unexpected DNS changes merit investigation but are not proof of an attack.'},
      {q:'Which record is relevant?',options:['DNS A record','Screen resolution','File extension'],answer:0,why:'An A record maps a hostname to an IPv4 address.'},
      {q:'Best response?',options:['Ignore the change','Compare with authorized DNS records and alert IT','Disable all DNS forever'],answer:1,why:'Verify against approved infrastructure before taking corrective action.'}
    ]
  },
  {
    level:2,title:'The Lookalike Domain',
    scenario:'A colleague receives https://secure-paypa1.example/account and believes it is the official PayPal login. The character before .example is the digit 1.',
    hint:'Look for visually similar letters and digits.',
    questions:[
      {q:'What technique is illustrated?',options:['Typosquatting / lookalike domain','Packet fragmentation','Port forwarding'],answer:0,why:'The domain imitates a familiar brand using a visually similar character.'},
      {q:'Does HTTPS make it trustworthy?',options:['Always','No','Only when the page has a logo'],answer:1,why:'Attackers can obtain certificates for domains they control.'},
      {q:'Best defense?',options:['Use a known official URL or app','Trust any green padlock','Enter a password to test it'],answer:0,why:'Use independently verified destinations for sensitive logins.'}
    ]
  },
  {
    level:3,title:'Port 22 Scan',
    scenario:'Firewall logs (fictional):\n203.0.113.40 → 192.0.2.10 TCP/22: 80 failed connection attempts in 60 seconds.\nPolicy: SSH access is restricted to 198.51.100.0/24.',
    hint:'Match source address and destination port to the written firewall policy.',
    questions:[
      {q:'Most likely pattern?',options:['Repeated unauthorized SSH probing','Normal HTTPS browsing','DNS resolution'],answer:0,why:'Repeated failures to SSH may indicate scanning or password guessing.'},
      {q:'Should the traffic be allowed?',options:['Yes','No, the source is outside the approved range','Only because it uses TCP'],answer:1,why:'The source is not within the allowed SSH source network.'},
      {q:'Appropriate defense?',options:['Allow all port 22 traffic','Block unauthorized access and review logs','Disable every network service'],answer:1,why:'Enforce least-privilege firewall rules and investigate repeated failures.'}
    ]
  },
  {
    level:3,title:'Legitimate Web Traffic',
    scenario:'Policy: Public website allows inbound TCP/443 from any source.\nPacket: 198.51.100.17 → 192.0.2.80 TCP/443.\nNo additional threat indicators are present.',
    hint:'A good firewall should not block legitimate requests without cause.',
    questions:[
      {q:'What is the policy decision?',options:['Allow','Block','Block every external IP'],answer:0,why:'The packet matches the published HTTPS allow rule.'},
      {q:'What service usually uses TCP port 443?',options:['HTTPS','DNS over UDP/53','SSH'],answer:0,why:'TCP/443 is commonly used for HTTPS.'},
      {q:'Why not block everything?',options:['Availability matters too','Firewalls cannot block traffic','Encryption stops working'],answer:0,why:'Security controls must preserve authorized availability.'}
    ]
  },
  {
    level:3,title:'A Sudden Traffic Spike',
    scenario:'A web server usually receives 100 requests/minute. It now receives 45,000 requests/minute from many simulated sources, and users report timeouts.',
    hint:'Think about availability rather than confidentiality.',
    questions:[
      {q:'What could this indicate?',options:['Possible DDoS attack','Confirmed data encryption','A digital signature'],answer:0,why:'A sudden distributed request surge with service disruption is consistent with DDoS.'},
      {q:'Which security goal is affected?',options:['Availability','Non-repudiation only','Password complexity'],answer:0,why:'Service disruption primarily threatens availability.'},
      {q:'Best mitigation?',options:['Publish passwords','Use rate limiting and upstream DDoS protection','Disable TLS'],answer:1,why:'Traffic filtering and DDoS mitigation help protect service availability.'}
    ]
  },
  {
    level:3,title:'Unexpected Outbound Connection',
    scenario:'A payroll server that normally talks only to internal systems starts sending frequent outbound connections to 203.0.113.77 TCP/4444. No approved software change exists.',
    hint:'Unusual traffic is evidence to investigate, not automatic proof of malware.',
    questions:[
      {q:'Best initial assessment?',options:['Suspicious outbound behavior requiring investigation','Definitely normal','Guaranteed ransomware'],answer:0,why:'Unexpected external connections from a sensitive server are suspicious but need corroboration.'},
      {q:'Which principle helps?',options:['Least privilege for outbound connections','Allow every destination','Remove monitoring'],answer:0,why:'Egress filtering restricts unnecessary outbound network access.'},
      {q:'Next step?',options:['Investigate process and connection logs; isolate if warranted','Ignore all alerts','Send confidential records to that address'],answer:0,why:'Correlate host and network evidence before containment.'}
    ]
  },
  {
    level:3,title:'DNS Query Burst',
    scenario:'Monitoring shows a workstation making thousands of unusual DNS queries to random-looking subdomains of one external domain. Other machines are quiet.',
    hint:'DNS traffic can sometimes be used as a covert communication channel.',
    questions:[
      {q:'What is one plausible concern?',options:['DNS tunneling or malicious beaconing','A valid digital signature','HTTPS certificate renewal only'],answer:0,why:'High-volume unusual subdomain queries can indicate DNS tunneling, although other explanations exist.'},
      {q:'Which protocol/service is involved?',options:['DNS','SSH','SMTP only'],answer:0,why:'DNS resolves names and commonly uses UDP/53, sometimes TCP/53.'},
      {q:'Best investigation?',options:['Review DNS logs and the originating process','Delete every DNS record','Disable all computers permanently'],answer:0,why:'Analyze the query pattern and process context to distinguish threats from benign activity.'}
    ]
  }
];

const $ = id => document.getElementById(id);
let index = 0, score = 0, lives = 3, hintUsed = false, finished = false;
const maxScore = cases.length * 30;
function show(screen){['home','game','result'].forEach(id=>$(id).classList.toggle('hidden',id!==screen));}
function start(){index=0;score=0;lives=3;finished=false;show('game');render();}
function render(){
  const item=cases[index];hintUsed=false;
  $('levelLabel').textContent=`Level ${item.level}: ${['','Phishing','URLs & TLS','Network Defense'][item.level]}`;
  $('progressLabel').textContent=`Case ${index+1}/${cases.length}`;
  $('livesLabel').textContent=`❤️ ${lives} lives`;
  $('scoreLabel').textContent=`⭐ ${score} points`;
  $('progressBar').style.width=`${(index/cases.length)*100}%`;
  $('caseLabel').textContent=`Investigation ${String(index+1).padStart(2,'0')}`;
  $('questionTitle').textContent=item.title;
  $('scenario').textContent=item.scenario;
  $('questions').replaceChildren();
  item.questions.forEach((question,qi)=>{
    const block=document.createElement('div');block.className='question';
    const title=document.createElement('h3');title.textContent=`${qi+1}. ${question.q}`;block.append(title);
    question.options.forEach((option,oi)=>{
      const label=document.createElement('label');label.className='option';
      const radio=document.createElement('input');radio.type='radio';radio.name=`q${qi}`;radio.value=String(oi);
      const text=document.createElement('span');text.textContent=option;label.append(radio,text);block.append(label);
    });
    $('questions').append(block);
  });
  $('feedback').classList.add('hidden');$('nextBtn').classList.add('hidden');$('submitBtn').disabled=false;
  $('hintBtn').disabled=false;
  $('nextBtn').textContent=index===cases.length-1?'View Results →':'Next Case →';
}
function hint(){if(hintUsed)return;hintUsed=true;score=Math.max(0,score-5);$('scoreLabel').textContent=`⭐ ${score} points`;window.alert('HINT: '+cases[index].hint);$('hintBtn').disabled=true;}
function submit(){
  const item=cases[index];const selections=item.questions.map((_,qi)=>document.querySelector(`input[name="q${qi}"]:checked`));
  if(selections.some(v=>!v)){window.alert('Answer all three questions before submitting.');return;}
  let correct=0;const feedback=$('feedback');feedback.replaceChildren();
  const heading=document.createElement('h3');feedback.append(heading);
  item.questions.forEach((q,qi)=>{
    const ok=Number(selections[qi].value)===q.answer;if(ok){correct++;score+=10;}
    const p=document.createElement('p');p.className=ok?'right':'wrong';
    p.textContent=`${ok?'✓':'✗'} Q${qi+1}: ${q.why} Correct answer: ${q.options[q.answer]}.`;
    feedback.append(p);
  });
  if(correct<2)lives--;
  heading.textContent=`${correct}/3 correct — ${correct<2?'Lost 1 life':'Investigation passed'}`;
  $('scoreLabel').textContent=`⭐ ${score} points`;$('livesLabel').textContent=`❤️ ${lives} lives`;
  $('submitBtn').disabled=true;$('hintBtn').disabled=true;
  document.querySelectorAll('#questions input').forEach(el=>el.disabled=true);
  feedback.classList.remove('hidden');$('nextBtn').classList.remove('hidden');
  if(lives<=0)$('nextBtn').textContent='View Results →';
}
function next(){if(lives<=0||index===cases.length-1){finish();return;}index++;render();}
function finish(){finished=true;show('result');$('progressBar').style.width='100%';
  const pct=Math.round(score/maxScore*100);
  const rank=pct>=85?'Cyber Expert':pct>=60?'Security Investigator':'Cybersecurity Trainee';
  $('resultTitle').textContent=lives<=0?'Investigation Ended':`Rank: ${rank}`;
  $('resultDetails').textContent=`Score: ${score}/${maxScore} (${pct}%). Cases completed: ${index+1}/${cases.length}. Remaining lives: ${lives}. ${lives<=0?'Your team ran out of lives. Try again!':'Great work reviewing cyber threats and defenses!'}`;
}
$('startBtn').addEventListener('click',start);
$('restartBtn').addEventListener('click',start);
$('hintBtn').addEventListener('click',hint);
$('submitBtn').addEventListener('click',submit);
$('nextBtn').addEventListener('click',next);
