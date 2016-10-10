# swichr

<h2>What is it?</h2>

An NPM module that allows you to replace all instances of a string with another (from an input file), while preserving casing & punctuation

<h2>How To Use</h2>

<ol>
	<li class="p1">
    Require the swichr module
    <pre>
    const swichr = require('swichr');
    </pre>
  </li>
	<li class="p1">
  Pass in (as arguments):
  <ul>
    <li>a path to your input file</li>
    <li>a path to your output file</li>
    <li>the replacing string</li>
    <li>the string-to-be-replaced</li>
  </ul>

  <pre>
  swichr('in.txt', 'out.txt', 'hi', 'where')
  </pre>
  </li>
</ol>

<h2>Example</h2>
<h3>in.txt</h3>
<pre>
This is a test where the word "where" appears in multiple cases.
Where?
Here, in this text file! WHERE? Here!
</pre>
<h3>the replacing string: 'hi'</h3>
<h3>the replacing string: 'where'</h3>
<h3>out.txt</h3>
<pre>
This is a test hi the word "hi" appears in multiple cases.
Hi?
Here, in this text file! HI? Here!
</pre>
