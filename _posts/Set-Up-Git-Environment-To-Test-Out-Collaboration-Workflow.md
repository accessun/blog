---
title: Set Up Git Environment To Test Out Collaboration Workflow
date: 2016-08-13 18:53:08
tags: Git
---

Git is a well-known version control system used for software development. Learning Git to control one's own project maybe one easy thing for a single software developer. He/She only has to download Git, install it, init a repo, and perhaps register an account on GitHub for personal use, and push his/her code to the remote on the registered GitHub account. These are the first steps to learn the basics of Git, such as how to checkout the old version of a project or new branches, how to carry out merge and rebase operations, etc. However, when it comes to collaboration, the basic knowledge of Git workflows becomes essential. Workflow basically means a way of collaborating in Git among several developers. To test out a workflow in order to get familiar with it, it is quite trivial to do all the commits by your own. And it is somewhat inconvenient to call up several of your friends to collaborate with you to help you learn Git workflow. I once came up with the idea that I register two GitHub account and contribute to the same repository. Well, admittedly, it feels a little bit awkward. So I turned to another solution.

The solution I'm using to play with and test out Git is to set up my own Git remote repo on a server. Then I can initialize different Git repos on my local machine that are linked to the same remote repo. Thus I have full control over the configurations of all my local repos, my remote repo and all the ways I want each "contributor" to behave in the collaboration workflow. So, in this way, it is exceedingly convenient to experiment with Git whatever the way you want. This solution I'm going to share here is simple and have little cost. The steps are introduced in the following content of this post.

### Run your Git server on a virtual machine

* Install [Ubuntu](http://http://www.ubuntu.com/global) or other free Linux distros that you like on your virtual machine as your Git remote server (The virtual machine I use is [Oracle VM VirtualBox](https://www.virtualbox.org/), which is freely downloadable from its official website.)

* Install Git, OpenSSH Server on your freshly install Git server.
```
$ sudo apt-get install git openssh-server
```

* Create a user account named `git` dedicated for Git service.
```
$ sudo adduser git
```

* Put your SSH public keys into `/home/git/.ssh/authorized_keys` (Just paste the content of your SSH public key file, such as `id_rsa.pub` into this file.) So you can have the privilege to push your changes to the remote repo we are about to set up on the server. If you don't know how to generate your public key, see the section at the end of the post.

* Initiate a bare repo in the `/srv/` directory and assign it appropriate ownership. Bare repo is a repository without working area. This is a repo intended for exchange changes among contributors, not for working. Typically, such repos are suffixed with `.git` extension name.
```
$ sudo git init --bare experiment.git
$ sudo chown -R git:git experiment.git
```

* Disable the login shell for user `git` for security reasons. Locate a line in `/etc/passwd` and change it.
```
git:x:1001:1001:,,,:/home/git:/bin/bash
# and change it to this:
git:x:1001:1001:,,,:/home/git:/usr/bin/git-shell
```

### Clone to your local machine and play with Git

Get the IP address of your server by `netstat -ie`. For example, the IP maybe `192.168.56.101`. Then you can clone the remote repo to your local machine (host machine) by `git clone git@192.168.56.101:/srv/experiment.git`. Note that, for VirtualBox, if you cannot communicate between host (your local machine that hosts your virtual machine) and guest (your virtual machine), select the settings of your virtual machine, then select "Network", and change the "Attached to" to "Host-only Adapter". And check out if you have properly installed `openssh-server` and started `sshd` service. Typically, Ubuntu starts `sshd` service by default on start up if you have installed `openssh-server`. Then re-check your the IP address of your server and clone with the right IP address.

Now you have set up your Git server. You can clone the remote repo into two different directories on your local machine, say `path/of/repo1` and `path/of/repo2`. You can then assign two different git account information to these two local repo respectively by the following two Git command.
```
$ git config user.name "Tyrion Lannister" # for repo1
$ git config user.email "tyrion@example.com" # for repo1
$ git config user.name "Brandon Stark" # for repo2
$ git config user.email "brandon@example.com" # for repo2
```

From this moment on, you are able to be the roles of two collaborators for a single project. Make changes and push to and pull from your remote repo. You can test out all the Git workflows you want on your own!

Make random changes to your repo can be mechanical and tedious if your goal is only to try out different Git operations, workflows and get the hang of it by repeating. So why not write a program to do it for you. The following is the Java program I wrote to make changes to two different repo on my local machine. Run the program. It will pop up a window with two buttons. Click the button. The program will either create empty text files or randomly append some content to some of the text files in the corresponding repo.

![](/images/modify_repo_interface.png)

The following two piece of code are the source of this program. You can copy them and change the paths `REPO_PATH_FIRST` and `REPO_PATH_SECOND` to the paths of your own local repo on your local machine. Make sure you have JDK (Java Development Kit) installed. Save the file, compile and run it by commands `javac *.java` and `java ModifyRepo`.

FileModifier.java
```java
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Random;
import java.util.UUID;

public class FileModifier {

    public static void createRandomFile(String path, int count) throws IOException {
        File file = new File(path);
        FileWriter fileWriter = null;
        for (int i = 0; i < count; i++) {
            fileWriter = new FileWriter(file + "/" + getRandomString() + ".txt");
            fileWriter.write("");
            fileWriter.close();
        }
    }

    public static void modifyRandomFile(String path) throws IOException {
        File[] files = new File(path).listFiles();
        if (files.length == 0) {
            createRandomFile(path, 1);
        }
        FileWriter writer = null;
        for (File file : files) {
            if (file.isFile() && new Random().nextBoolean()) {
                writer = new FileWriter(file, true);
                writer.write(getRandomString() + " -- " + System.currentTimeMillis() + "\n");
                writer.close();
            }
        }
    }

    private static String getRandomString() {
        return UUID.randomUUID().toString();
    }
}
```

ModifyRepo.java
```java
import java.awt.EventQueue;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.IOException;
import java.util.Random;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JPanel;

public class ModifyRepo {

    private static final String REPO_PATH_FIRST = "C:/Users/sun/Desktop/git/repo1"; // Change this to your own local repo
    private static final String REPO_PATH_SECOND = "C:/Users/sun/Desktop/git/repo2"; // Change this to your own local repo
    private static final int NUMBER_OF_FILES_INFLUENCED_PER_CHANGE = 1; // If you want to influence more files per click, increase this value.

    public static void createOrModifyFiles(String path, int count) {
        if (new Random().nextBoolean()) {
            try {
                FileModifier.createRandomFile(path, count);
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            try {
                FileModifier.modifyRandomFile(path);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static void main(String[] args) {
        String repoPath1 = REPO_PATH_FIRST;
        String repoPath2 = REPO_PATH_SECOND;
        int count = NUMBER_OF_FILES_INFLUENCED_PER_CHANGE;

        EventQueue.invokeLater(new Runnable() {
            @Override
            public void run() {
                JFrame frame = new JFrame("Repo Selector");
                frame.setSize(300, 80);
                frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
                frame.setVisible(true);

                JPanel panel = new JPanel();
                panel.setLayout(new GridLayout(1, 2));

                JButton button1 = new JButton("Modify Repo 1");
                JButton button2 = new JButton("Modify Repo 2");

                button1.addActionListener(new ActionListener() {
                    @Override
                    public void actionPerformed(ActionEvent e) {
                        createOrModifyFiles(repoPath1, count);
                    }
                });

                button2.addActionListener(new ActionListener() {
                    @Override
                    public void actionPerformed(ActionEvent e) {
                        createOrModifyFiles(repoPath2, count);
                    }
                });

                panel.add(button1);
                panel.add(button2);
                frame.add(panel);
            }
        });
    }
}
```

### Generate your own SSH key pair for Git authentication

Note that the way we use to communicate with server is through SSH (Secure SHell). This simplifies the way we push to or pull from the remote and at the same time ensures security. You only have to upload your public key to the server. On push or pull, the server will recognize that it is you who are trying to establish communication with it. To generate SSH key pair, open Git Bash command window and type `ssh-genkey -t rsa -C "you.email@email.com"`. Then following the steps to the end. Then append the content of `id_rsa.pub`, which is your freshly generated public key file in the `.ssh` directory in your home directory, to `/home/git/.ssh/authorized_keys`.
